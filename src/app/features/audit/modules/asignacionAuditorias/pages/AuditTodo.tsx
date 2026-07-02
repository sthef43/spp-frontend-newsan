/* eslint-disable react/display-name */
import React from "react";
import { ITodo } from "app/models/ITodo";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { TodoSliceRequests } from "app/Middleware/reducers/TodoSlice";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { AuditTodoForm } from "app/features/audit/modules/asignacionAuditorias/components/AuditTodoForm";
import { SelectOFPlant } from "app/shared/helpers/SelectOfPlant";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { AppUserSliceRequests } from "app/Middleware/reducers/AppUserSlice";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";

export const AuditTodo = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();

  const planta = useAppSelector((state) => state.plant.object);
  const todos = useAppSelector((state) => state.todo.dataAll);

  const [ModalOpen, setModalOpen] = React.useState(false);
  const [editState, setEditState] = React.useState<ITodo | null>(null);

  const onGetTodos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const infoUser = unwrapResult(await dispatch(AppUserSliceRequests.getInfoUserById(GetInfoUser().id | 0)));
      await dispatch(
        TodoSliceRequests.getAllByPlantIdAndRolRequest({ plantId: planta.id, rolId: infoUser?.permisos?.rol?.id })
      );
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    } catch (e) {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
      openNotificationUI(e, "error");
    }
  };

  React.useEffect(() => {
    planta && onGetTodos();
  }, [planta]);

  React.useEffect(() => {
    TitleChanger("Asignacion de Auditorias");
  }, []);

  return (
    <div className="my-2 mx-4 h-full">
      <SelectOFPlant />
      {planta && (
        <TableComponent
          buscar={true}
          IDcolumn={"id"}
          columns={[
            {
              title: "Nombre Auditoria",
              field: "audit.name"
            },
            {
              title: "Linea",
              field: "lineaProduccion.nombre"
            },
            {
              title: "SubRol",
              field: "subRol.name"
            },
            {
              title: "Turno",
              field: "turno.nombre"
            }
          ]}
          agregar={() => {
            setModalOpen(true);
          }}
          dataInfo={todos}
          Collapse={true}
          Edit={(rowData) => {
            {
              setEditState({
                id: rowData.id,
                auditId: rowData.auditId,
                subRolId: rowData.subRolId,
                rolId: rowData.rolId,
                createdDate: rowData.createdDate,
                turnoId: rowData.turnoId,
                cantSample: rowData.cantSample
              });
              setModalOpen(true);
            }
          }}
        />
      )}
      <ModalCompoment title="Creacion de nueva auditoria a realizar" openPopup={ModalOpen} setOpenPopup={setModalOpen}>
        <AuditTodoForm setOpenPopup={setModalOpen} editState={editState} refresh={onGetTodos} />
      </ModalCompoment>
    </div>
  );
};
