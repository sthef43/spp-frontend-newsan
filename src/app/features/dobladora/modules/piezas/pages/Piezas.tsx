import React, { useEffect, useState } from "react";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { IDobSemi } from "app/models/IDobSemi";
import { DobSemiSliceRequests } from "app/Middleware/reducers/DobSemiSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { AppUserSliceRequests } from "app/Middleware/reducers/AppUserSlice";
import { PiezasForm } from "../modals/PiezasForm";

export const Piezas = (): JSX.Element => {
  const [semielaboradoList, setSemielaboradoList] = useState(null);
  const dispatch = useAppDispatch();
  const [DataOpen, setData] = useState(null);
  const { openNotificationUI } = useNotificationUI();
  const [estaEditando, setEstaEditando] = useState(false);

  const { TitleChanger } = useTitleOfApp();
  const { getConfirmation } = useConfirmationDialog();

  //Eliminar
  const deleteSemielaborado = async (row) => {
    const resp = await getConfirmation("Borrar pieza", "Esta seguro que quiere eliminar esta pieza?");
    if (resp) {
      try {
        const response = unwrapResult(await dispatch(DobSemiSliceRequests.deleteRequest(row)));
        if (response) {
          openNotificationUI("Se elimino la pieza correctamente", "success");
          getSemielaborados();
        }
      } catch (error) {
        openNotificationUI("Error al eliminar la pieza.", "error");
      }
    }
  };

  //Viendo que trare el user
  const getUsuarios = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      unwrapResult(await dispatch(AppUserSliceRequests.getAllRequest()));
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (error) {
      openNotificationUI("Error al leer usuario.", "error");
    }
  };

  const getSemielaborados = async () => {
    try {
      const result = unwrapResult(await dispatch(DobSemiSliceRequests.getAllRequest()));
      setSemielaboradoList(result);
    } catch (error) {
      openNotificationUI("Error al leer piezas.", "error");
    }
  };
  useEffect(() => {
    getSemielaborados();
    getUsuarios();
  }, []);

  const [ModalOpen, setModalOpen] = React.useState(false);
  const [editState, setEditState] = React.useState<IDobSemi | null>(null);
  React.useEffect(() => {
    if (semielaboradoList?.length > 0) {
      setData(JSON.parse(JSON.stringify(semielaboradoList)));
    }
  }, [semielaboradoList]);

  React.useEffect(() => {
    TitleChanger("PIEZAS");
  }, []);

  const editar = (rowData) => {
    setEditState({ ...rowData });
    setEstaEditando(true);
    setModalOpen(true);
  };

  return (
    <div className="my-2 mx-4 h-full">
      <TableComponent
        Dense={true}
        Overflow={true}
        buscar={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Código",
            field: "codigo"
          },
          {
            title: "Descripción",
            field: "descripcion"
          },
          {
            title: "Tipo de Aire",
            field: "dobTipoAA.descripcion"
          },
          {
            title: "Capacidad",
            field: "dobCapacidad.descripcion"
          },
          {
            title: "Tipo de Frigoría",
            field: "dobTipoFrigoria.descripcion"
          },
          {
            title: "Proveedor",
            field: "dobProveedor.descripcion"
          },
          {
            title: "Versión de Producto",
            field: "versionProducto"
          },
          {
            title: "Versión de Pieza",
            field: "versionPieza"
          },
          {
            title: "Subensamble",
            field: "dobSubEnsamble.descripcion"
          },
          {
            title: "Nivel 1 Subensamble",
            field: "n1SubEnsamble"
          },
          {
            title: "Nivel 2 Subensamble",
            field: "n2SubEnsamble"
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
                          deleteSemielaborado(row.id);
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
        dataInfo={DataOpen}
      />
      <ModalCompoment title="Nueva Pieza" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <PiezasForm
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={getSemielaborados}
          estaEditando={estaEditando}
        />
      </ModalCompoment>
    </div>
  );
};
