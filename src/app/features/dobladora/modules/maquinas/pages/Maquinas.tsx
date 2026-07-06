import { Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { DobHMaquinaSliceRequests } from "app/Middleware/reducers/DobHMaquinaSlice";
import { useAppDispatch } from "app/core/store/store";
import { IDobHMaquina } from "app/models/IDobHMaquina";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { MaquinasForm } from "app/features/dobladora/modules/maquinas/modals/MaquinasForm";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useState } from "react";

export const Maquinas = (): JSX.Element => {
  const { TitleChanger } = useTitleOfApp();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  //Leer
  const [listMaquinas, setlistMaquinas] = useState([]);
  const getMaquinas = async () => {
    try {
      const responses = unwrapResult(await dispatch(DobHMaquinaSliceRequests.getListDobHMaquina()));
      setlistMaquinas(responses);
    } catch (error) {
      openNotificationUI("Error al leer máquinas.", "error");
    }
  };

  //Eliminar
  const deleteMaquina = async (row) => {
    if (row.dobHHistorial.length == 0) {
      const resp = await getConfirmation("Borrar máquina", "Esta seguro que quiere eliminar esta máquina?");
      if (resp) {
        try {
          const response = unwrapResult(await dispatch(DobHMaquinaSliceRequests.deleteRequest(row.id)));
          if (response) {
            openNotificationUI("Se elimino la máquina correctamente", "success");
            getMaquinas();
          }
        } catch (error) {
          openNotificationUI("Error al eliminar máquina.", "error");
        }
      }
    } else {
      openNotificationUI("Tiene herramentales asignados, no puede eliminar.", "error");
    }
  };

  //Editar
  const [estaEditando, setEstaEditando] = useState(false);
  const [editState, setEditState] = useState<IDobHMaquina | null>(null);
  const [ModalOpen, setModalOpen] = useState(false);
  const editar = (rowData) => {
    setEditState({ ...rowData });
    setEstaEditando(true);
    setModalOpen(true);
  };

  useEffect(() => {
    TitleChanger("MAQUINAS");
    getMaquinas();
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
              <h1>Máquina sin Herramentales</h1>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <ContainerForPages optionsLayout="Table" activeEffectVisible>
      <TableComponent
        Dense={true}
        // Overflow={true}
        buscar={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Número",
            field: "numero"
          },
          {
            title: "Descripción",
            field: "descripcion"
          },
          {
            title: "Tipo",
            field: "",
            render: (row) => {
              return (
                row.dobHTipoMaquina.id + "- " + row.dobHTipoMaquina.codigo + " - " + row.dobHTipoMaquina.descripcion
              );
            }
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
                          deleteMaquina(row);
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
        dataInfo={listMaquinas}
        Collapse
        CollapseExtraModulesBefore={ExtraModulesCollapse}
      />
      <ModalCompoment title="Nueva Máquina" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <MaquinasForm
          setOpenPopup={setModalOpen}
          editState={editState}
          refresh={getMaquinas}
          estaEditando={estaEditando}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
