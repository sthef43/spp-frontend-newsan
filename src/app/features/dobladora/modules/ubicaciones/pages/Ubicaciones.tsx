import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { DobHUbicacionSliceRequests } from "app/Middleware/reducers/DobHUbicacionSlice";
import { useAppDispatch } from "app/core/store/store";
import { IDobHUbicacion } from "app/models/IDobHUbicacion";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { UbicacionesForm } from "app/features/dobladora/modules/ubicaciones/modals/UbicacionesForm";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";

export const Ubicaciones = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  //Leer
  const [listUbicaciones, setlistUbicaciones] = useState([]);
  const getUbicaciones = async () => {
    try {
      const responses = unwrapResult(await dispatch(DobHUbicacionSliceRequests.getListDobHUbicacion()));
      setlistUbicaciones(responses);
    } catch (error) {
      openNotificationUI("Error al leer ubicaciones.", "error");
    }
  };

  //Eliminar
  const deleteUbicacion = async (row) => {
    if (row.dobHHistorial.length == 0) {
      const resp = await getConfirmation("Borrar ubicación", "Esta seguro que quiere eliminar la ubicación?");
      if (resp) {
        try {
          const response = unwrapResult(await dispatch(DobHUbicacionSliceRequests.deleteRequest(row.id)));
          if (response) {
            openNotificationUI("Se eliminó la ubicación correctamente", "success");
            getUbicaciones();
          }
        } catch (error) {
          openNotificationUI("Error al eliminar ubicacion.", "error");
        }
      }
    } else {
      openNotificationUI("Tiene herramentales asignados, no puede eliminar.", "error");
    }
  };

  //Editar
  const [estaEditando, setEstaEditando] = useState(false);
  const [editState, setEditState] = useState<IDobHUbicacion | null>(null);
  const [ModalOpen, setModalOpen] = useState(false);
  const editar = (rowData) => {
    setEditState({ ...rowData });
    setEstaEditando(true);
    setModalOpen(true);
  };

  useEffect(() => {
    TitleChanger("UBICACIONES");
    getUbicaciones();
  }, []);

  //Muestra lista de herramentaes por máquina
  const ExtraModulesCollapse = ({ row }: any) => {
    return (
      <>
        <div className="p-5 m-2 rounded-lg shadow-elevation-4 bg-secondaryNew">
          {row.dobHHistorial.length > 0 ? (
            <div>
              <div className="flex justify-center font-medium py-3">Herramentales Asignados</div>
              <TableComponent
                columns={[
                  {
                    title: "Código",
                    field: "dobHHerramental.codigo"
                  },
                  {
                    title: "Tipo",
                    field: "dobHHerramental.dobHTipo.codigo"
                  },
                  {
                    title: "Diametro Tubo",
                    field: "dobHHerramental.dobHDiametroTubo.descripcion"
                  },
                  {
                    title: "Radio Medio",
                    field: "dobHHerramental.dobHRadioMedio.codigo"
                  },
                  {
                    title: "Tipo de Máquina",
                    field: "dobHHerramental.dobHTipoMaquina.codigo"
                  }
                ]}
                IDcolumn={"id"}
                dataInfo={row.dobHHistorial}
              />
            </div>
          ) : (
            <div className="flex justify-center font-medium">
              <h1>Ubicación sin Herramentales</h1>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="my-2 mx-4 h-full">
      <TableComponent
        Dense={true}
        // Overflow={true}
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
            title: "Tipo",
            field: "dobHTipoUbicacion.descripcion"
          },
          {
            title: "Herramentales Asignados",
            field: "dobHHistorial.length"
          },
          {
            title: "Diámetro",
            field: "",
            render: (row) => {
              if (row.dobHHistorial.length == 0) {
                return;
              } else {
                return row.dobHHistorial[0].dobHHerramental.dobHDiametroTubo.descripcion;
              }
            }
          },
          {
            title: "Radio",
            field: "",
            render: (row) => {
              if (row.dobHHistorial.length == 0) {
                return;
              } else {
                return row.dobHHistorial[0].dobHHerramental.dobHRadioMedio.codigo;
              }
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
                          deleteUbicacion(row);
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
        dataInfo={listUbicaciones}
        Collapse
        CollapseExtraModulesBefore={ExtraModulesCollapse}
      />
      <ModalCompoment title="Nueva Ubicación" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <UbicacionesForm
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={getUbicaciones}
          estaEditando={estaEditando}
        />
      </ModalCompoment>
    </div>
  );
};
