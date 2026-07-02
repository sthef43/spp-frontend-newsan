import { Edit } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { LineasRechazoHabilitadasSliceRequest } from "app/Middleware/reducers/LineasRechazoHabilitadasSlice";
import { ILineasRechazoHabilitadas } from "app/models/ILineasRechazoHablitadas";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import FetchApi from "app/shared/helpers/FetchApi";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { LineasRechazoHabilitadasAddForm } from "./modals/LineaRechazoHabillitadasAddForm";
import { LineaRechazoHabilitasEditForm } from "./modals/LineaRechazoHabilitadasEditModal";
import { ILinea } from "app/models";
import { LineaSliceRequests } from "app/Middleware/reducers/LineaSlice";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";

export const LineasRechazoHabilitadasPage = () => {
  const { TitleChanger } = useTitleOfApp();
  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [dataLineasHabilitadas, setLineasHabilitadas] = useState<ILineasRechazoHabilitadas[]>([]);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [rowSelected, setRowSelected] = useState<ILineasRechazoHabilitadas>();
  const [listadoLineas, setListadoLineas] = useState<ILinea[]>([]);

  //Fetchs info
  FetchApi<ILineasRechazoHabilitadas[]>(
    LineasRechazoHabilitadasSliceRequest.getAllRequest,
    null,
    true,
    null,
    setLineasHabilitadas,
    false
  );

  //Fetchs info
  FetchApi<ILinea[]>(LineaSliceRequests.getAllRequest, null, true, null, setListadoLineas, false);

  const deletedPuestoLinea = async (row: ILineasRechazoHabilitadas) => {
    try {
      if (await getConfirmation("Borrar puesto", "Desea borrar el puesto asignado?", null, "Confirmar", "Cancelar")) {
        const updateLinea = row;
        updateLinea.deleted = true;
        const response = unwrapResult(await dispatch(LineasRechazoHabilitadasSliceRequest.PutRequest(updateLinea)));
        if (response) {
          openNotificationUI("Se borro el puesto correctamente!", "success");
          const responseLineas = unwrapResult(await dispatch(LineasRechazoHabilitadasSliceRequest.getAllRequest()));
          setLineasHabilitadas(responseLineas);
        }
      } else {
        console.log("cancelada la borrada de la linea brother");
      }
    } catch (err) {
      console.log(err);
      openNotificationUI(err, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const renderIcon = (condicional: boolean) => {
    return (
      <main>
        {condicional ? (
          <div>
            <DoneIcon />
          </div>
        ) : (
          <div>
            <ClearIcon />
          </div>
        )}
      </main>
    );
  };

  useEffect(() => {
    TitleChanger("Configuración lineas de rechazo habilitadas");
  }, []);

  const EditLinea = (row) => {
    console.log("edit", row);
  };

  return (
    <ContainerForPages optionsLayout="page">
      <ContainerForPages optionsLayout="personalized" classNamePersonalized="w-full pt-3 flex flex-col px-3">
        <TableComponent
          Dense={true}
          buscar={true}
          IDcolumn={"id"}
          columns={[
            {
              title: "Linea",
              field: "",
              render: (row) => {
                return row.linea.descripcion;
              }
            },
            {
              title: "Puesto cargadora",
              field: "",
              render: (row: ILineasRechazoHabilitadas) => renderIcon(row.puestoCargadora)
            },
            {
              title: "Puesto Run Test",
              field: "",
              render: (row: ILineasRechazoHabilitadas) => renderIcon(row.puestoRunTest)
            },
            {
              title: "Puesto Pro Trace",
              field: "",
              render: (row: ILineasRechazoHabilitadas) => renderIcon(row.puestoProTrace)
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <main>
                    {row.puestoProTrace == true ? (
                      <div>
                        <DoneIcon />
                      </div>
                    ) : (
                      <div>
                        <ClearIcon />
                      </div>
                    )}
                  </main>
                );
              }
            },
            {
              title: "Acciones",
              field: "",
              render: (row) => {
                return (
                  <div className="flex w-full justify-start gap-4">
                    <Tooltip title="Editar puesto de rechazo">
                      <div>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setRowSelected(row);
                            setOpenModalEdit(true);
                            EditLinea(row);
                          }}>
                          <Edit />
                        </IconButton>
                      </div>
                    </Tooltip>
                    <Tooltip title="Borrar Puesto de rechazo">
                      <div>
                        <IconButton
                          size="small"
                          onClick={() => {
                            deletedPuestoLinea(row);
                          }}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    </Tooltip>
                  </div>
                );
              }
            }
          ]}
          agregar={() => {
            setOpenModalAdd(true);
            setOpenModalEdit(false);
          }}
          dataInfo={dataLineasHabilitadas}
        />
      </ContainerForPages>
      <ModalCompoment title={"Agregar Linea"} openPopup={openModalAdd} setOpenPopup={setOpenModalAdd}>
        <LineasRechazoHabilitadasAddForm
          lineasData={listadoLineas}
          setopenModal={setOpenModalAdd}
          setListado={setLineasHabilitadas}
        />
      </ModalCompoment>
      <ModalCompoment title="Editar Linea" openPopup={openModalEdit} setOpenPopup={setOpenModalEdit}>
        <LineaRechazoHabilitasEditForm
          rowSelected={rowSelected}
          lineasData={listadoLineas}
          setopenModal={setOpenModalEdit}
          setListado={setLineasHabilitadas}
        />
      </ModalCompoment>
    </ContainerForPages>
  );
};
