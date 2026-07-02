import React, { useEffect, useState } from "react";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import CalidadInspeccionTareaForm from "./CalidadInspeccionTareaForm";
import { unwrapResult } from "@reduxjs/toolkit";
import { CalidadInspeccionTareaSliceRequest } from "app/Middleware/reducers/CalidadInspeccionTareaSlice";
import { useAppDispatch } from "app/core/store/store";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { ICalidadInspeccionTarea } from "app/models/ICalidadInspeccionTarea";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { Edit, Delete } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";

const CalidadTareasInspeccionTable = () => {
  const [openModal, setOpenModal] = useState(false);

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();

  const [tareas, setTareas] = useState<ICalidadInspeccionTarea[]>([]);
  const [existingTasks, setExistingTasks] = useState<string[]>([]);
  const [editState, setEditState] = useState<ICalidadInspeccionTarea | null>(null);
  const [edit, setEdit] = useState<boolean>(false);

  const getData = async () => {
    try {
      const responses = unwrapResult(await dispatch(CalidadInspeccionTareaSliceRequest.getAllRequest()));
      setTareas(responses);
      setExistingTasks(responses.map((d) => d.tarea));
    } catch (error) {
      openNotificationUI("Error al obtener los datos .", "error");
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const refresh = () => {
    getData();
  };

  const onAdd = () => {
    setOpenModal(true);
  };

  const onEdit = (task: ICalidadInspeccionTarea) => {
    setEditState(task);
    setEdit(true);
    setOpenModal(true);
  };

  const onDelete = async (id) => {
    try {
      const resp = await getConfirmation("Borrar Tarea de inspeccion", "¿Esta seguro que quiere eliminar la tarea?");
      if (!resp) return;
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(CalidadInspeccionTareaSliceRequest.deleteRequest(id)));
      if (response) {
        openNotificationUI("Registro Eliminado Correctamente", "success");
        refresh();
      }
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI("Ocurrio Un error al intentar eliminar el registro", "error");
    }
  };

  return (
    <div>
      <TableComponent
        agregar={onAdd}
        buscar={true}
        IDcolumn={"id"}
        columns={[
          {
            title: "Tarea",
            field: "tarea"
          },
          {
            title: "Nivel",
            field: "nivel"
          },
          {
            title: "Suma Ranking",
            field: "",
            render: (row: ICalidadInspeccionTarea) => {
              return (
                <div className="w-full">
                  <span
                    className={`text-xl tracking-tighter 
                          ${row.sumaRanking ? "text-green-800" : "text-red-800"}  font-bold`}>
                    {row.sumaRanking ? "SI" : "NO"}
                  </span>
                </div>
              );
            }
          },
          {
            title: "Porcentaje de muestras",
            field: "porcentajeMuestras"
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
                          onEdit(row);
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
                          onDelete(row.id);
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
        dataInfo={tareas}
      />
      <ModalCompoment setOpenPopup={setOpenModal} openPopup={openModal} title="Inspeccion Tareas Form">
        <CalidadInspeccionTareaForm
          setModal={setOpenModal}
          existingtasks={existingTasks}
          refresh={refresh}
          editState={editState}
          edit={edit}
        />
      </ModalCompoment>
    </div>
  );
};

export default CalidadTareasInspeccionTable;
