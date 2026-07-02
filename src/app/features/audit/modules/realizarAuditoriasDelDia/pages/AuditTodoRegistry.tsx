import { TodoSliceRequests } from "app/Middleware/reducers/TodoSlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ITodoToday } from "app/models/ITodoToday";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
//import classNames from "classnames";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
//import DoneIcon from "@mui/icons-material/Done";
import { IconButton, Tooltip } from "@mui/material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { GetInfoUser } from "app/shared/helpers/userConfig";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { AppUserSliceRequests } from "app/Middleware/reducers/AppUserSlice";
import { SelectOFPlant } from "app/shared/helpers/SelectOfPlant";
import { TableComponent } from "app/shared/components/Table/TableComponent";
import { CheckCircleOutline } from "@mui/icons-material";

export const AuditTodoRegistry = (): JSX.Element => {
  const classes = MaterialButtons();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { openNotificationUI } = useNotificationUI();
  const { TitleChanger } = useTitleOfApp();
  const planta = useAppSelector((state) => state.plant.object);
  const [todoArray, setTodoArray] = useState<ITodoToday[]>([]);

  const onGetTodos = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const infoUser = unwrapResult(await dispatch(AppUserSliceRequests.getInfoUserById(GetInfoUser().id | 0)));
      const response = unwrapResult(
        await dispatch(
          TodoSliceRequests.getTodoToday({
            rolId: infoUser?.permisos?.rolId,
            subRolId: infoUser?.permisos?.subrolId,
            turnoId: infoUser?.operator?.turnoId,
            plantId: planta.id
          })
        )
      );
      setTodoArray(response);
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
    TitleChanger("Auditorías a realizar hoy");
  }, []);
  const doPerformAudit = (auditId: number, todoId: number) => {
    history.push(`/main/auditoria/perform/${auditId}/0/${todoId}`);
  };
  return (
    <main className="px-4 mt-4">
      <SelectOFPlant />
      {/* <div className="my-2 bg-secondaryNew shadow-elevation-4 border-t-2 md:border-0 border-gray-600 rounded-lg animate__animated animated__fadeIn">
        {todoArray && planta && (
          <div>
            <div className="hidden md:grid grid-cols-10 text-2xl text-center font-medium bg-blue-600 text-gray-200 rounded-lg">
              <div className="col-span-3">Auditoría</div>
              <div className="col-span-2">Número de Registro</div>
              <div className="col-span-2">Linea</div>
              <div className="col-span-2">Cantidad Faltante</div>
              <div className="col-span-1"></div>
            </div>
            {todoArray.map((todo) => (
              <div
                key={todo.todoItem.id}
                className="py-2 px-6 md:px-0 grid grid-cols-5 md:grid-cols-10 text-lg text-left md:text-center font-medium border-b-2 items-center border-gray-600 rounded-lg">
                <div className="col-span-2 font-bold md:hidden">Auditoria</div>
                <div className="col-span-3 md:col-span-3">{todo.todoItem.audit.name}</div>
                <div className="col-span-2 font-bold md:hidden">N° registro</div>
                <div className="col-span-3 md:col-span-2">{todo.todoItem.audit.numberRegistry}</div>
                <div className="col-span-2 font-bold md:hidden">Linea</div>
                <div className="col-span-3 md:col-span-2">{todo.todoItem?.lineaProduccion?.nombre}</div>
                <div className="col-span-2 font-bold md:hidden">Faltante</div>
                <div
                  className={classNames(
                    todo.cantidad > 0 ? "font-bold text-red-600" : "font-bold text-green-600",
                    "col-span-3 md:col-span-2"
                  )}>
                  {todo.cantidad}
                </div>
                <div className="col-span-2 font-bold md:hidden">Realizar</div>
                <div className="col-span-3 md:col-span-1">
                  <IconButton
                    size="small"
                    disabled={todo.cantidad < 1}
                    className={classes.greenButton}
                    onClick={() => {
                      doPerformAudit(todo.todoItem.audit.id, todo.todoItem.id);
                    }}>
                    <DoneIcon />
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div> */}
      <div>
        <TableComponent
          IDcolumn="id"
          buscar
          dataInfo={todoArray}
          columns={[
            {
              title: "Auditoría",
              field: "todoItem.audit.name"
            },
            {
              title: "Número de Resgistro",
              field: "todoItem.audit.numberRegistry"
            },
            {
              title: "Linea",
              field: "todoItem.lineaProduccion.nombre"
            },
            {
              title: "Cantidad Faltante",
              field: "cantidad"
            },
            {
              title: "Acciones",
              field: "todoItem",
              render: (todoItem) => {
                return (
                  <div>
                    <Tooltip title="Realizar Auditoria">
                      <IconButton
                        size="small"
                        onClick={() => doPerformAudit(todoItem.todoItem.audit.id, todoItem.todoItem.id)}>
                        <CheckCircleOutline color="success" sx={{ fontSize: "2rem" }} />
                      </IconButton>
                    </Tooltip>
                  </div>
                );
              }
            }
          ]}
        />
      </div>
    </main>
  );
};
