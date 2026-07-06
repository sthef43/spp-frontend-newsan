/* eslint-disable unused-imports/no-unused-vars */
import { IRoutes } from "app/models/IRoutes";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Tooltip, useMediaQuery } from "@mui/material";
import { AsignarImagenSegunPadre } from "../Utils/AsignarImagenSegunPadre";
import { AddRounded, Star } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IAppUser } from "app/models";
import { RoutesFavoritesOperatorBloqSliceRequest } from "app/Middleware/reducers/RoutesFavoritesOperatorBloqSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { ModalCompoment } from "../../ModalComponent";
import { CambiarModuloPrioridadModal } from "../Modals/CambiarModuloPrioridadModal";

interface Props {
  listaRoutes: IRoutes[];
  setListaRoutes: (newValue: IRoutes[]) => void;
}

export const ListaRoutesFavoritesComponent: React.FC<Props> = ({ listaRoutes, setListaRoutes }) => {
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as IAppUser);

  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const stylesBotonAgregarMobile =
    "cursor-pointer row-start-4 col-span-1 bg-[#E2E8F0] h-36 text-center rounded-md p-5 text-[#253b92] flex items-center justify-center overflow-hidden break-words hover:bg-primaryNew transition-colors hover:text-white md:h-36 lg:h-[7.2rem]";

  const [openModalCambiarConfirmacion, setOpenModalCambiarConfirmacion] = useState(false);

  //FUNCION QUE DIRIJE A LA RUTA QUE TIENE EL BOTON
  const pushRoute = (routes: IRoutes) => {
    history.push(`/main/${routes.ruta}`);
  };

  const mostrarFavoritos = (index: number) => {
    if (!isDesktop) {
      return index < 6;
    } else {
      return index < 12;
    }
  };

  const eliminarFavorito = async (routeFavorite: IRoutes) => {
    const routeDelete = { operatorId: infoUser.operatorId, routeId: routeFavorite.id };
    try {
      if (await getConfirmation("Eliminar Favotiro", "Se eliminara la ruta favorita seleccionada", null, "Aceptar")) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen());
        const response = unwrapResult(
          await dispatch(RoutesFavoritesOperatorBloqSliceRequest.SearchAndDeleteFavorite(routeDelete))
        );
        if (response) {
          const refresh = unwrapResult(
            await dispatch(RoutesFavoritesOperatorBloqSliceRequest.GetAllRoutesByOperatorId(infoUser.operatorId))
          );
          setListaRoutes(refresh);
          openNotificationUI("Se elimino la ruta correctamente", "success");
        }
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  return (
    <>
      {listaRoutes &&
        listaRoutes.length > 0 &&
        listaRoutes.map((elementos, index) => {
          const routePrioridad = elementos.prioridad
            ? "col-span-2 row-start-1 md:col-span-2 lg:col-span-1"
            : "col-span-1";
          return (
            <>
              <div
                onClick={() => pushRoute(elementos)}
                className={mostrarFavoritos(index) ? `block ${routePrioridad} mt-4 cursor-pointer` : "hidden"}>
                <div className="group">
                  {mostrarFavoritos(index) && (
                    <>
                      {elementos.prioridad ? (
                        <div className="flex flex-row justify-between w-full items-center md:h-36 lg:h-[7.2rem] p-4 bg-gradient-to-r rounded-md shadow-sm from-blue-500 to-newsan text-white">
                          <div className="flex flex-col gap-2">
                            <p className="text-sm">Prioridad</p>
                            <p className="font-semibold text-2xl md:text-xl">{elementos.nombre}</p>
                          </div>
                          <div>
                            <AsignarImagenSegunPadre padre={elementos.padre} />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-start p-4 rounded-md justify-between bg-secondaryNew border gap-y-2 shadow-sm h-36 md:h-36 lg:h-auto cursor-pointer group-hover:bg-[#0250d085] group-hover:text-white group-hover:scale-105 group-hover:transition-all duration-300">
                          <div className="flex flex-row w-full justify-between items-center">
                            <AsignarImagenSegunPadre padre={elementos.padre} />
                            <TooltipComponent
                              componenteIcono={<Star sx={{ color: "#da8200" }} className="cursor-pointer" />}
                              titleTooltip="Eliminar de Favoritos"
                              typeTooltip="normal"
                              onClick={(e) => {
                                e.stopPropagation();
                                eliminarFavorito(elementos);
                              }}
                            />
                          </div>
                          <div className="flex flex-col">
                            <p className="text-base capitalize">{elementos.nombre}</p>
                            <p className="text-xs text-gray-500 capitalize">{elementos.padre}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </>
          );
        })}
      <div className="mt-4">
        <Tooltip title="Cambiar Modulo de Prioridad">
          <div
            onClick={() => {
              setOpenModalCambiarConfirmacion(true);
            }}
            className={`${listaRoutes && listaRoutes.length <= 4 ? "col-start-1" : ""} ${stylesBotonAgregarMobile}`}>
            <AddRounded fontSize="large" />
          </div>
        </Tooltip>
      </div>
      <ModalCompoment
        setOpenPopup={setOpenModalCambiarConfirmacion}
        openPopup={openModalCambiarConfirmacion}
        title="Cambiar Modulo de Prioridad"
        showModalCenterPage
        titleModalStyle="Audit">
        <CambiarModuloPrioridadModal
          listaRutas={listaRoutes}
          setRutasFavoritas={setListaRoutes}
          setOpenModal={setOpenModalCambiarConfirmacion}
          openModal={openModalCambiarConfirmacion}
        />
      </ModalCompoment>
    </>
  );
};
