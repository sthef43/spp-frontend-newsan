/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import FetchApi from "app/shared/helpers/FetchApi";
import { PermisosRoutesSliceRequests } from "app/features/manejoSistema/slices/PermisosRoutesSlice";
import { IAppUser } from "app/models";
import { Sliders } from "app/shared/components/Sliders";
import { IRoutes } from "app/models/IRoutes";
import { Add, Delete } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { IRoutesFavoritesOperatorBloq } from "app/models/IRoutesFavoritesOperatorBloq";
import { RoutesFavoritesOperatorBloqSliceRequest } from "app/Middleware/reducers/RoutesFavoritesOperatorBloqSlice";
import { RutasConPadresDTO } from "app/models/DTO/RutasConPadresDTO";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  setRefreshFavoritos: (newValue: IRoutes[]) => void;
  listadoRutasFavoritas: IRoutes[];
}

export const AgregarRutasFavoritasModal: React.FC<Props> = ({
  setOpenModal,
  openModal,
  setRefreshFavoritos,
  listadoRutasFavoritas
}) => {
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as IAppUser);

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [expandend, setExpanded] = useState<string | false>(false);
  const [opcionSlider, setOpcionSlider] = useState<string>("");

  const [listaRutas, setListaRutas] = useState<RutasConPadresDTO[]>([]);
  FetchApi<RutasConPadresDTO[]>(
    PermisosRoutesSliceRequests.GetAllFathersWithRoutes,
    infoUser.permisosId,
    false,
    openModal,
    setListaRutas,
    true
  );

  const añadirNuevoFavorito = async (routeId: number) => {
    const nuevoFavorito: IRoutesFavoritesOperatorBloq = { operatorId: infoUser.operatorId, routesId: routeId };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      if ((listadoRutasFavoritas?.length ?? 0) <= 10) {
        const response = unwrapResult(
          await dispatch(RoutesFavoritesOperatorBloqSliceRequest.PostRequest(nuevoFavorito))
        );
        if (response) {
          const refresh = unwrapResult(
            await dispatch(RoutesFavoritesOperatorBloqSliceRequest.GetAllRoutesByOperatorId(infoUser.operatorId))
          );
          const refreshModal = unwrapResult(
            await dispatch(PermisosRoutesSliceRequests.GetAllFathersWithRoutes(infoUser.permisosId))
          );
          setListaRutas(refreshModal);
          setRefreshFavoritos(refresh);
          openNotificationUI("Se añadio correctamente la ruta", "success");
        }
      } else {
        openNotificationUI("Se alcanzo el limite de rutas", "warning");
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const eliminarFavorito = async (routeFavorite) => {
    try {
      console.log(routeFavorite);
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(
          RoutesFavoritesOperatorBloqSliceRequest.SearchAndDeleteFavorite({
            operatorId: infoUser.operatorId,
            routeId: routeFavorite.id
          })
        )
      );
      if (response) {
        const refresh = unwrapResult(
          await dispatch(RoutesFavoritesOperatorBloqSliceRequest.GetAllRoutesByOperatorId(infoUser.operatorId))
        );
        const refreshModal = unwrapResult(
          await dispatch(PermisosRoutesSliceRequests.GetAllFathersWithRoutes(infoUser.permisosId))
        );
        setListaRutas(refreshModal);
        setRefreshFavoritos(refresh);
        openNotificationUI("Se elimino la ruta correctamente", "success");
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  return (
    <main className="w-[70vw]">
      <section className="flex flex-col gap-y-4 w-full">
        {listaRutas && (
          <>
            {listaRutas.map((elementos, index) => (
              <div key={index}>
                <Sliders
                  nameSlider={elementos.routePadre}
                  titleSlider={elementos.routePadre}
                  expandend={expandend}
                  setExpanded={setExpanded}
                  setOpcionSlider={setOpcionSlider}
                  elementJSX={
                    <>
                      <div className="flex flex-col gap-y-4 justify-center w-full">
                        {elementos.routes && elementos.routes.length > 0 ? (
                          elementos.routes.map((elementosRoutes, index) => {
                            let routeEncontrada = false;
                            if (listadoRutasFavoritas && listadoRutasFavoritas.length > 0) {
                              routeEncontrada = listadoRutasFavoritas.some((elementos) => {
                                return elementos.id == elementosRoutes.id;
                              });
                            }
                            return (
                              <figure
                                key={index}
                                className="flex flex-row justify-between w-full border border-gray-200 rounded-md p-4 shadow-md items-center transition-colors">
                                <div className="flex flex-row w-full justify-between items-center">
                                  <div>
                                    <h2 className="mb-2 font-medium">Nombre Modulo: {elementosRoutes.nombre}</h2>
                                  </div>
                                  <div className="flex flex-row items-center gap-x-4">
                                    <div>
                                      <>
                                        {!routeEncontrada ? (
                                          <Tooltip title="Añadir Ruta">
                                            <span>
                                              <IconButton
                                                onClick={() => {
                                                  añadirNuevoFavorito(elementosRoutes.id);
                                                }}
                                                size="small"
                                                style={{ position: "relative" }}>
                                                <Add color="primary" />
                                              </IconButton>
                                            </span>
                                          </Tooltip>
                                        ) : (
                                          <Tooltip title="Eliminar Ruta">
                                            <span>
                                              <IconButton
                                                onClick={() => {
                                                  eliminarFavorito(elementosRoutes);
                                                }}
                                                size="small"
                                                style={{ position: "relative" }}>
                                                <Delete color="warning" />
                                              </IconButton>
                                            </span>
                                          </Tooltip>
                                        )}
                                      </>
                                    </div>
                                  </div>
                                </div>
                              </figure>
                            );
                          })
                        ) : (
                          <p>No se encontraron modulos disponibles</p>
                        )}
                      </div>
                    </>
                  }></Sliders>
              </div>
            ))}
          </>
        )}
      </section>
    </main>
  );
};
