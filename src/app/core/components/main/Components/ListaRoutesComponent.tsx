/* eslint-disable unused-imports/no-unused-vars */
import { IRoutes } from "app/models/IRoutes";
import React, { useEffect, useState } from "react";
import { AsignarImagenSegunPadre } from "../Utils/AsignarImagenSegunPadre";
import { Star, StarBorder } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import { useAppSelector } from "app/core/store/store";
import { IAppUser } from "app/models";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { RoutesFavoritesOperatorBloqSliceRequest } from "app/Middleware/reducers/RoutesFavoritesOperatorBloqSlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { IRoutesFavoritesOperatorBloq } from "app/models/IRoutesFavoritesOperatorBloq";
import { TooltipComponent } from "app/shared/helpers/ComponentsMUIModify/TooltipComponent";
import { useHistory } from "react-router-dom";

interface Props {
  listaRoutesFavoritas: IRoutes[];
  listaRoutes: IRoutes[];
  filtradoSelect: string;
  filtradoInput: string;
  setListaRutasFavoritas: (listaRoutesFavoritas: IRoutes[]) => void;
}

export const ListaRoutesComponent: React.FC<Props> = ({
  listaRoutesFavoritas,
  listaRoutes,
  filtradoSelect,
  filtradoInput,
  setListaRutasFavoritas
}) => {
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as IAppUser);

  const { getConfirmation } = useConfirmationDialog();
  const { openNotificationUI } = useNotificationUI();
  const { FetchPost } = useFetchApiMultiResults();

  const dispatch = useAppDispatch();
  const isDesktop = useMediaQuery("(min-width: 1204px)");
  const history = useHistory();

  const [listaRoutesRandom, setListaRoutesRandom] = useState<IRoutes[]>([]);

  const cargarNuevaRutaFavortia = async (route: IRoutes) => {
    const verificarCantidad = verificarCantidadAgregadas();
    if (!verificarCantidad) {
      return;
    }
    const nuevaRutaFavorita: IRoutesFavoritesOperatorBloq = { operatorId: infoUser.operatorId, routesId: route.id };
    if (await getConfirmation("Agregar Ruta a Favoritos", "La ruta seleccionada se agregara a favoritos")) {
      FetchPost(RoutesFavoritesOperatorBloqSliceRequest.PostRequest, nuevaRutaFavorita, false, async () => {
        const refresh = unwrapResult(
          await dispatch(RoutesFavoritesOperatorBloqSliceRequest.GetAllRoutesByOperatorId(infoUser.operatorId))
        );
        setListaRutasFavoritas(refresh);
        openNotificationUI("La ruta se agrego a favoritos con exito", "success");
      });
    }
  };

  const verificarCantidadAgregadas = () => {
    if (listaRoutesFavoritas.length === 11) {
      openNotificationUI("Solo se pueden agregar 11 rutas a favoritos", "warning");
      return false;
    }
    return true;
  };

  const generarRutasAletorias = () => {
    const cantidadRutas = isDesktop ? 7 : 4;
    const nuevaListaRandom: IRoutes[] = [];
    for (let i = 0; i < cantidadRutas; i++) {
      const rutaAleatoria = listaRoutes[Math.floor(Math.random() * listaRoutes.length)];
      nuevaListaRandom.push(rutaAleatoria);
    }
    return nuevaListaRandom;
  };

  useEffect(() => {
    setListaRoutesRandom(generarRutasAletorias());
  }, [listaRoutes]);

  useEffect(() => {
    let listaRoutesFiltrada = listaRoutes;
    if (filtradoInput !== "" || filtradoSelect !== "") {
      listaRoutesFiltrada = listaRoutesFiltrada.filter((ruta) => {
        return (
          ruta.nombre.toLowerCase().includes(filtradoInput.toLowerCase()) &&
          ruta.padre.toLowerCase().includes(filtradoSelect.toLowerCase())
        );
      });
    } else {
      listaRoutesFiltrada = generarRutasAletorias();
    }
    setListaRoutesRandom(listaRoutesFiltrada);
  }, [filtradoInput, filtradoSelect]);

  return (
    <div className="mt-4">
      {filtradoSelect === "" && filtradoInput === "" ? (
        <>
          {listaRoutesRandom && listaRoutesRandom.length > 0 && (
            <div className="flex flex-col w-full gap-y-4 lg:rounded-lg md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-4 ">
              {listaRoutesRandom.map((ruta, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 gap-2 gap-x-2 bg-secondaryNew w-full h-14 rounded cursor-pointer hover:scale-105 transition-all duration-150 group lg:border"
                  onClick={() => history.push(`/main/${ruta.ruta}`)}>
                  <div className="flex items-center gap-2 gap-x-2 w-full justify-between">
                    <AsignarImagenSegunPadre padre={ruta.padre} />
                    <div className="flex flex-col">
                      <h2 className="text-xs font-semibold">{ruta.nombre}</h2>
                      <p className="text-xs text-gray-500">{ruta.padre}</p>
                    </div>
                    <button className="ml-auto">
                      {listaRoutesFavoritas.find((item) => item.id === ruta.id) ? (
                        <Star sx={{ color: "#da8200" }} />
                      ) : (
                        <TooltipComponent
                          componenteIcono={<StarBorder />}
                          titleTooltip="Agregar a Favoritos"
                          typeTooltip="normal"
                          onClick={(e) => {
                            e.stopPropagation();
                            cargarNuevaRutaFavortia(ruta);
                          }}
                        />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {listaRoutesRandom && listaRoutesRandom.length > 0 && (
            <div className="flex flex-col w-full gap-y-4 lg:rounded-lg md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-4 lg:gap-4">
              {listaRoutesRandom.map((ruta, index) => (
                <div
                  key={index}
                  className="flex items-center p-2 gap-2 gap-x-2 bg-secondaryNew w-full h-14 rounded cursor-pointer hover:scale-105 transition-all duration-150 group lg:border"
                  onClick={() => history.push(`/main/${ruta.ruta}`)}>
                  <div className="flex items-center gap-2 gap-x-2 w-full justify-between">
                    <AsignarImagenSegunPadre padre={ruta.padre} />
                    <div className="flex flex-col">
                      <h2 className="text-xs font-semibold">{ruta.nombre}</h2>
                      <p className="text-xs text-gray-500">{ruta.padre}</p>
                    </div>
                    <button className="ml-auto">
                      {listaRoutesFavoritas.find((item) => item.id === ruta.id) ? (
                        <Star sx={{ color: "#da8200" }} />
                      ) : (
                        <TooltipComponent
                          componenteIcono={<StarBorder />}
                          titleTooltip="Agregar a Favoritos"
                          typeTooltip="normal"
                          onClick={(e) => {
                            e.stopPropagation();
                            cargarNuevaRutaFavortia(ruta);
                          }}
                        />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
