/* eslint-disable unused-imports/no-unused-vars */
import React from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IRoutes } from "app/models/IRoutes";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";
import { Star } from "@mui/icons-material";
import { List, ListItem, IconButton, ListItemText, Tooltip } from "@mui/material";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { RoutesFavoritesOperatorBloqSliceRequest } from "app/Middleware/reducers/RoutesFavoritesOperatorBloqSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { IAppUser } from "app/models/IAppUser";
import { CambiarRutaPrioritariaDTO } from "../Models/CambiarRutaPrioritariaDTO";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  listaRutas: IRoutes[];
  setRutasFavoritas: (newValue: IRoutes[]) => void;
}

export const CambiarModuloPrioridadModal: React.FC<Props> = ({
  setOpenModal,
  openModal,
  listaRutas,
  setRutasFavoritas
}) => {
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as IAppUser);

  const { FetchPut } = useFetchApiMultiResults();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const cambiarPrioridad = async (route: IRoutes) => {
    const routePrioridad: CambiarRutaPrioritariaDTO = { routes: route, operatorId: infoUser.operatorId };
    FetchPut({
      consoleLog: false,
      modelPut: routePrioridad,
      activeConfirmation: false,
      sliceRequest: RoutesFavoritesOperatorBloqSliceRequest.ChangeRoutePriority,
      functionAdd: async () => {
        const response = unwrapResult(
          await dispatch(RoutesFavoritesOperatorBloqSliceRequest.GetAllRoutesByOperatorId(infoUser.operatorId))
        );
        openNotificationUI(`Se cambio la ruta ${route.nombre} a prioridad correctamente`, "success");
        setRutasFavoritas(response);
      }
    });
  };

  return (
    <ContainerForPages optionsLayout="personalized" classNamePersonalized="w-[65vw]" activeEffectVisible>
      <List
        sx={{
          width: "100%",
          overflowY: "auto",
          backgroundColor: "var(--background-color)",
          marginTop: "12px",
          borderRadius: "10px",
          padding: "0"
        }}>
        {listaRutas.map((item) => {
          const labelId = `checkbox-list-label-${item.id}`;
          return (
            <ListItem
              sx={{
                borderBottom: "1px solid #d3cecec9",
                padding: "12px"
              }}
              key={item.id}
              secondaryAction={
                <IconButton edge="end" aria-label="comments">
                  <Tooltip title={`Poner como prioridad a ${item.nombre}`}>
                    <Star onClick={() => cambiarPrioridad(item)} color={item.prioridad ? "primary" : "disabled"} />
                  </Tooltip>
                </IconButton>
              }
              disablePadding>
              <ListItemText id={labelId} primary={`Nombre del valor: ${item.nombre}`} />
            </ListItem>
          );
        })}
      </List>
    </ContainerForPages>
  );
};
