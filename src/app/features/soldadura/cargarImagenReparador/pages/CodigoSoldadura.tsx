import { Delete, Edit, Error } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { CodigoSoldaduraSliceRequests } from "app/Middleware/reducers/CodigoSoldaduraSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { ICodigoSoldadura } from "app/models/ICodigoSoldadura";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { CodigoSoldaduraForm } from "app/features/soldadura/cargarImagenReparador/modals/CodigoSoldaduraForm";
// import { VisualizarImagen } from "app/shared/components/soldadura/codigoSoldadura/VisualizarImagen";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";

export const CodigoSoldadura = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();

  //Leer Codigo Soldadura
  const [codigoSoldadura, setCodigoSoldadura] = useState<ICodigoSoldadura[] | null>([]);
  const getCodigoSoldadura = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));

      const responses = unwrapResult(await dispatch(CodigoSoldaduraSliceRequests.GetAllRequest()));
      setCodigoSoldadura(responses);
      console.log("Codigo Soldadura", responses);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI("Error al leer.", "error");
    }
  };

  //Visualizar Imagen
  // const [modalVerImagen, setModalVerImagen] = useState(false);
  // const [stringImagen, setStringImagen] = useState("");
  // const visualiza = (imagen: string) => {
  //   console.log(imagen);
  //   setModalVerImagen(true);
  //   setStringImagen(imagen);
  // };

  //Editar
  const [editState, setEditState] = React.useState<ICodigoSoldadura | null>(null);
  const [estaEditando, setEstaEditando] = useState(false);
  const [ModalOpen, setModalOpen] = useState(false);
  const editar = (rowData) => {
    setEditState({ ...rowData, generico: rowData.generico.trim(), puesto: rowData.puesto.trim() });
    setEstaEditando(true);
    setModalOpen(true);
  };

  //Eliminar
  const deleted = async (row) => {
    const resp = await getConfirmation("Borrar registro", "Esta seguro que quiere eliminar el registro?");
    if (resp) {
      try {
        unwrapResult(await dispatch(CodigoSoldaduraSliceRequests.DeleteRequest(row)));
        openNotificationUI("Se eliminó el registro correctamente", "success");
        getCodigoSoldadura();
      } catch (error) {
        openNotificationUI("Error al eliminar el registro.", "error");
      }
    }
  };

  useEffect(() => {
    TitleChanger("CODIGOS DE SOLDADURA");
    getCodigoSoldadura();
  }, []);

  return (
    <div className="my-2 mx-4 h-full">
      <TableComponent
        Dense={true}
        buscar={true}
        IDcolumn={"idSoldadura"}
        columns={[
          {
            title: "Generico",
            field: "generico"
          },
          {
            title: "Puesto",
            field: "puesto"
          },
          {
            title: "Imagen",
            field: "imagen"
          },
          {
            title: "Imagen Newsan",
            field: "imagenNewsan",
            render: (row) => {
              return (
                <div>
                  {/* {row.imagenNewsan} */}
                  {row.imagenNewsan != "" && row.imagenNewsan != null ? (
                    <div>
                      {/* <IconButton
                        onClick={() => {
                          visualiza(row.imagenNewsan)
                        }}
                        size="small"
                        color="success"
                        style={{ position: "relative" }}>
                        <Image />
                      </IconButton> */}
                      {row.imagenNewsan}
                    </div>
                  ) : (
                    <IconButton size="small" color="error" style={{ position: "relative" }}>
                      <Error />
                    </IconButton>
                  )}
                </div>
              );
            }
          },
          {
            title: "Acciones",
            field: "",
            render: (row) => {
              return (
                <div className="flex w-full justify-end sm:justify-start gap-4">
                  <div>
                    <Tooltip title="Editar">
                      <IconButton
                        onClick={() => {
                          editar(row);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <div>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => {
                          deleted(row.id);
                        }}
                        size="small"
                        style={{ position: "relative" }}>
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              );
            }
          }
        ]}
        agregar={() => {
          setEstaEditando(false);
          setEditState(null);
          setModalOpen(true);
        }}
        dataInfo={codigoSoldadura}
      />

      <ModalCompoment title="Editar / Agregar Código de Soldadura" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <CodigoSoldaduraForm
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={getCodigoSoldadura}
          estaEditando={estaEditando}
          listCodigosSoldadura={codigoSoldadura}
        />
      </ModalCompoment>

      {/* <ModalCompoment title="Vista de Imagen" openPopup={modalVerImagen} setOpenPopup={setModalVerImagen}>
        <VisualizarImagen Imagen={stringImagen} />
      </ModalCompoment> */}
    </div>
  );
};
