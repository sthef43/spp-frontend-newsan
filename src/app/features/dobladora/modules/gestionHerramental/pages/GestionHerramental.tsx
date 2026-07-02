import { Delete, Edit, OutputRounded, Settings, SyncAltTwoTone } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { DobHHistorialSliceRequests } from "app/Middleware/reducers/DobHHistorialSlice";
import { useAppDispatch } from "app/core/store/store";
import { IDobHHistorial } from "app/models/IDobHHistorial";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { GestionHerramentalForm } from "app/features/dobladora/modules/gestionHerramental/modals/GestionHerramentalForm";
import { MovimientosMasivosForm } from "app/features/dobladora/modules/gestionHerramental/modals/MovimientosMasivosForm";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { isNull } from "lodash";
import moment from "moment";
import React, { useEffect, useState } from "react";

export const GestionHerramental = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const [estaEditando, setEstaEditando] = useState(false);
  const [editState, setEditState] = useState<IDobHHistorial | null>(null);
  const [ModalOpen, setModalOpen] = useState(false);
  const [ModalMMOpen, setModalMMOpen] = useState(false);

  //Leer
  const [listHistorial, setlistHistorial] = useState([]);
  const getHistorial = async () => {
    try {
      const responses = unwrapResult(await dispatch(DobHHistorialSliceRequests.getListDobHHistorial()));
      setlistHistorial(responses);
    } catch (error) {
      openNotificationUI("Error al leer historial.", "error");
    }
  };

  //Eliminar
  const deleteHistorial = async (row) => {
    const resp = await getConfirmation("Borrar historial", "Esta seguro que quiere eliminar el historial?");
    if (resp) {
      try {
        const response = unwrapResult(await dispatch(DobHHistorialSliceRequests.deleteRequest(row)));
        if (response) {
          openNotificationUI("Se eliminó el historial correctamente", "success");
          getHistorial();
        }
      } catch (error) {
        openNotificationUI("Error al eliminar historial.", "error");
      }
    }
  };

  //Edición individual
  const editar = (rowData) => {
    const obj = {
      ...rowData,
      dobHUbicacionId: rowData.dobHUbicacionId != null ? rowData.dobHUbicacionId : 0,
      dobHMaquinaId: rowData.dobHMaquinaId != null ? rowData.dobHMaquinaId : 0
    };
    setEditState(obj);
    setEstaEditando(true);
    setModalOpen(true);
  };

  //Movimientos Masivos Form
  const MovimientosMasivos = () => {
    setModalMMOpen(true);
  };

  useEffect(() => {
    TitleChanger("GESTION HERRAMENTAL");
    getHistorial();
  }, []);

  return (
    <div className="my-2 mx-4 h-full">
      <div className="p-2 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
        <Button
          variant="outlined"
          color="success"
          size="large"
          style={{ position: "static", width: "20%" }}
          onClick={() => {
            MovimientosMasivos();
          }}>
          <OutputRounded />
          <SyncAltTwoTone />
          <Settings />
        </Button>
      </div>

      <TableComponent
        Dense={true}
        Overflow={true}
        buscar={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Id",
            field: "id"
          },
          {
            title: "Herramental",
            field: "dobHHerramental.codigo"
          },
          {
            title: "Id TM H",
            field: "dobHHerramental.dobHTipoMaquinaId"
          },
          {
            title: "Ubicación",
            field: "",
            render: (row) => {
              if (!isNull(row.dobHUbicacion)) {
                return row.dobHUbicacion.codigo + " - " + row.dobHUbicacion.descripcion;
              }
            }
          },
          {
            title: "Máquina",
            field: "dobHMaquina.numero"
          },
          {
            title: "Id TM M",
            field: "dobHMaquina.dobHTipoMaquinaId"
          },
          {
            title: "Dias de Uso",
            field: "diasDeUso"
          },
          {
            title: "Fecha Modificación",
            field: "",
            render: (row) => {
              return moment(row.lastModifiedDate).format("L");
            }
          },
          {
            title: "Usuario",
            field: "",
            render: (row) => {
              return row.appUser.operator.surname + " " + row.appUser.operator.name;
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
                          deleteHistorial(row.id);
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
        dataInfo={listHistorial}
      />
      <ModalCompoment title="Movimiento Individual" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <GestionHerramentalForm
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={getHistorial}
          estaEditando={estaEditando}
        />
      </ModalCompoment>
      <ModalCompoment title="Movimiento Masivo" openPopup={ModalMMOpen} setOpenPopup={setModalMMOpen}>
        <MovimientosMasivosForm setOpenPopup={setModalMMOpen} refresh={getHistorial} />
      </ModalCompoment>
    </div>
  );
};
