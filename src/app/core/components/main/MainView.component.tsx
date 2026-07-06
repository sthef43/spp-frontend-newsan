/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { RoutesFavoritesOperatorBloqSliceRequest } from "app/Middleware/reducers/RoutesFavoritesOperatorBloqSlice";
import { useAppSelector } from "app/core/store/store";
import { IAppUser } from "app/models";
import { IRoutes } from "app/models/IRoutes";
import FetchApi from "app/shared/helpers/FetchApi";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { FilterAltRounded, SearchRounded } from "@mui/icons-material";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import { useForm } from "react-hook-form";
import { ListaRoutesFavoritesComponent } from "./Components/ListaRoutesFavoritesComponent";
import { SelectComponent } from "app/features/cli/Components/SelectComponent";
import { PermisosRoutesSliceRequests } from "app/features/manejoSistema/slices/PermisosRoutesSlice";
import { RutasConPadresDTO } from "app/models/DTO/RutasConPadresDTO";
import { ListaRoutesComponent } from "./Components/ListaRoutesComponent";
import { SkeletonComponent } from "app/shared/helpers/Layouts/Skeleton/SkeletonComponent";
import { ContainerForPages } from "app/shared/helpers/Containers/ContainerForPages";

export const MainViewComponent = () => {
  const { control, watch } = useForm();
  const { TitleChanger } = useTitleOfApp();

  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as IAppUser);

  const [listaRutasPadre, serListaRutasPadre] = useState<string[]>([]);

  const [listaRoutes, setListaRoutes] = useState<IRoutes[]>([]);
  const [listaRutas, setListaRutas] = useState<RutasConPadresDTO[]>([]);

  const [rutaPadreSeleccionada, setRutaPadreSeleccionada] = useState<string | number>("");

  const filtroNameWatch = watch("filtroName");

  FetchApi<IRoutes[]>(
    RoutesFavoritesOperatorBloqSliceRequest.GetAllRoutesByOperatorId,
    infoUser.operatorId,
    true,
    null,
    setListaRoutes
  );

  FetchApi<RutasConPadresDTO[]>(
    PermisosRoutesSliceRequests.GetAllFathersWithRoutes,
    infoUser.permisosId,
    false,
    infoUser,
    setListaRutas,
    false,
    true,
    true,
    (response) => {
      serListaRutasPadre(response.map((item) => item.routePadre));
    }
  );

  useEffect(() => {
    TitleChanger("Inicio");
  }, []);

  return (
    <ContainerForPages activeEffectVisible optionsLayout="page">
      <section>
        <div>
          <h2 className="text-2xl font-semibold">Modulos Favoritos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            <ListaRoutesFavoritesComponent listaRoutes={listaRoutes} setListaRoutes={setListaRoutes} />
          </div>
        </div>
        <div className="mt-4">
          <h2 className="text-2xl font-semibold">Todos los Módulos</h2>
          <div className="flex flex-col gap-3 mt-3 md:flex-row">
            <div className="w-full md:w-3/4">
              <TextFieldComponent
                control={control}
                activePropsInput
                inputProps={{
                  startAdornment: <SearchRounded fontSize="small" color="disabled" />
                }}
                estilosPersonalizados={{
                  backgroundColor: "var(--secondary-color)"
                }}
                labelInput="Buscar Modulo"
                index={0}
                nameInput="filtroName"
                valueDefault=""
              />
            </div>
            <div className="w-full md:w-1/4">
              <SelectComponent
                startAdornment
                iconoStartAdornment={<FilterAltRounded fontSize="small" color="disabled" />}
                control={control}
                inputLabel="Filtrar Por"
                listaObjetos={listaRutasPadre}
                estilosPersonalizados={{
                  backgroundColor: "var(--secondary-color)"
                }}
                nameSelect="filtrarPor"
                valueKey={(e) => e}
                valueLabel={(e) => e}
                valueSelect={(e) => e}
                ValueSave={setRutaPadreSeleccionada}
              />
            </div>
          </div>
        </div>
        {listaRutas.length === 0 ? (
          <div className="mt-4">
            <SkeletonComponent typeSkeleton="List" />
          </div>
        ) : (
          <ListaRoutesComponent
            listaRoutesFavoritas={listaRoutes}
            listaRoutes={listaRutas.flatMap((item) => item.routes)}
            filtradoSelect={rutaPadreSeleccionada as string}
            filtradoInput={filtroNameWatch}
            setListaRutasFavoritas={setListaRoutes}
          />
        )}
      </section>
    </ContainerForPages>
  );
};
