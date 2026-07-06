import React, { useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Button, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { DobMaestroPiezaliceRequests } from "app/Middleware/reducers/DobMaestroPiezaSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { IDobMaestroPieza } from "app/models/IDobMaestroPieza";
import { MaestroPiezaForm } from "app/features/dobladora/modules/maestroPieza/modals/MaestroPiezaForm";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { MaestroPiezaExl } from "app/features/dobladora/modules/maestroPieza/modals/MaestroPiezaExl";

export const MaestroPieza = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const { getConfirmation } = useConfirmationDialog();
  const classes = MaterialButtons();

  useEffect(() => {
    TitleChanger("MAESTRO DE PIEZAS");
    getMaestroPieza();
  }, []);

  //Leer
  const [listMaestroPieza, setListMaestroPieza] = useState<IDobMaestroPieza[] | null>(null);
  const getMaestroPieza = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const result = unwrapResult(await dispatch(DobMaestroPiezaliceRequests.getAllRequest()));
      setListMaestroPieza(result);
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI("Error al leer.", "error");
    }
  };

  //Eliminar
  const deleteMaestroPieza = async (row) => {
    const resp = await getConfirmation("Borrar maestro de pieza", "Esta seguro que quiere eliminar el registro?");
    if (resp) {
      try {
        unwrapResult(await dispatch(DobMaestroPiezaliceRequests.deleteRequest(row)));
        openNotificationUI("Se elimino la pieza correctamente", "success");
        getMaestroPieza();
      } catch (error) {
        openNotificationUI("Error al eliminar el registro.", "error");
      }
    }
  };

  //Editar
  const [editState, setEditState] = useState<IDobMaestroPieza[] | null>(null);
  const [estaEditando, setEstaEditando] = useState(false);
  const [ModalOpen, setModalOpen] = useState(false);
  const editar = (rowData) => {
    setEditState({ ...rowData });
    setEstaEditando(true);
    setModalOpen(true);
  };

  //Excel
  const [modalImportar, setModalImportar] = useState(false);

  return (
    <div className="my-2 mx-4 h-full">
      <div className="pt-5 flex justify-end mr-4" style={{ flex: "1 1 20%" }}>
        <Button
          className={classes.purpleButton}
          size="large"
          variant="contained"
          onClick={() => {
            setModalImportar(true);
          }}>
          Importar
        </Button>
      </div>
      <TableComponent
        Dense={true}
        buscar={true}
        excel
        IDcolumn={"id"}
        columns={[
          {
            title: "Artículo",
            field: "articulo"
          },
          {
            title: "Genérico",
            field: "generico"
          },
          {
            title: "Descripcion",
            field: "descripcion"
          },
          {
            title: "Tipo",
            field: "tipo"
          },
          {
            title: "Materia Prima",
            field: "codigoMP"
          },
          {
            title: "Dimension",
            field: "dimension"
          },
          {
            title: "Consumo",
            field: "consumo"
          },
          {
            title: "Proveedor",
            field: "proveedor"
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
                          deleteMaestroPieza(row.id);
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
        dataInfo={listMaestroPieza}
      />
      <ModalCompoment title="Form Maestro de Piezas" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <MaestroPiezaForm
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={getMaestroPieza}
          estaEditando={estaEditando}
        />
      </ModalCompoment>
      <ModalCompoment title="Importación de Archivo Excel" openPopup={modalImportar} setOpenPopup={setModalImportar}>
        <MaestroPiezaExl
          setOpenPopup={setModalImportar}
          refresh={getMaestroPieza}
          listMaestroPieza={listMaestroPieza}
        />
      </ModalCompoment>
    </div>
  );
};
