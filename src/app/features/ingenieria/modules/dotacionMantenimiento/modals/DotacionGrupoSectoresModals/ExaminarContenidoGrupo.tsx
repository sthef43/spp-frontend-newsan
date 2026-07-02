import { Add, Delete } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import FetchApi from "app/shared/helpers/FetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { Sliders } from "app/shared/components/Sliders";
import React, { useState } from "react";
import { IDotacionGrupoSectores } from "../../models/IDotacionGrupoSectores";
import { IDotacionGrupoSectoresBloque } from "../../models/IDotacionGrupoSectoresBloque";
import { IDotacionSector } from "../../models/IDotacionSector";
import { DotacionGrupoSectoresBloqueSliceRequest } from "../../reducers/DotacionGrupoSectoresBloqueSlice";
import { DotacionSectorSliceRequest } from "../../reducers/DotacionSectorSlice";

interface Props {
  grupoSeleccionado: IDotacionGrupoSectores;
}

export const ExaminarContenidoGrupo: React.FC<Props> = ({ grupoSeleccionado }) => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [expandend, setExpanded] = useState<string | false>(false);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [opcionSlider, setOpcionSlider] = useState("Agregar");

  // const [listaSectores, setListaSectores] = useState<IDotacionSector[]>([])
  // FetchApi<IDotacionSector[]>(DotacionGrupoSectoresSliceRequest.GetAllWithGroup, grupoSeleccionado.id, false, null, setListaSectores)

  const [listaSectores, setListaSectores] = useState<IDotacionSector[]>([]);
  FetchApi<IDotacionSector[]>(
    DotacionSectorSliceRequest.GetAllWithGroup,
    grupoSeleccionado.id,
    false,
    null,
    setListaSectores
  );

  const [listaSectoresSinGrupo, setListaSectoresSinGrupo] = useState<IDotacionSector[]>([]);
  FetchApi<IDotacionSector[]>(
    DotacionSectorSliceRequest.GetAllItemsWithoutGroup,
    grupoSeleccionado.id,
    false,
    null,
    setListaSectoresSinGrupo
  );

  const eliminarGrupo = async (dotacionSector: IDotacionSector) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const responseElinar = unwrapResult(
        await dispatch(
          DotacionGrupoSectoresBloqueSliceRequest.DeleteBloqBySectorAndGrupoId({
            sectorId: dotacionSector.id,
            grupoId: grupoSeleccionado.id
          })
        )
      );
      if (responseElinar) {
        const responseWithoutGroup = unwrapResult(
          await dispatch(DotacionSectorSliceRequest.GetAllItemsWithoutGroup(grupoSeleccionado.id))
        );
        const responseWithGroup = unwrapResult(
          await dispatch(DotacionSectorSliceRequest.GetAllWithGroup(grupoSeleccionado.id))
        );
        if (responseWithGroup && responseWithoutGroup) {
          openNotificationUI("Se agrego con exito el nuevo sector", "info");
          setListaSectores(responseWithGroup);
          setListaSectoresSinGrupo(responseWithoutGroup);
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const añadirGrupo = async (dotacionGrupo: IDotacionSector) => {
    const nuevoBloque: IDotacionGrupoSectoresBloque = {
      dotacionSectoresId: dotacionGrupo.id,
      dotacionGrupoSectoresId: grupoSeleccionado.id
    };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(await dispatch(DotacionGrupoSectoresBloqueSliceRequest.PostRequest(nuevoBloque)));
      if (response) {
        const responseWithoutGroup = unwrapResult(
          await dispatch(DotacionSectorSliceRequest.GetAllItemsWithoutGroup(grupoSeleccionado.id))
        );
        const responseWithGroup = unwrapResult(
          await dispatch(DotacionSectorSliceRequest.GetAllWithGroup(grupoSeleccionado.id))
        );
        if (responseWithGroup && responseWithoutGroup) {
          openNotificationUI("Se agrego con exito el nuevo sector", "info");
          setListaSectores(responseWithGroup);
          setListaSectoresSinGrupo(responseWithoutGroup);
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
    <main className="w-[60vw]">
      <Sliders
        nameSlider="sectoresAgregados"
        titleSlider="Sectores agregados"
        expandend={expandend}
        setExpanded={setExpanded}
        setOpcionSlider={setOpcionSlider}
        elementJSX={
          <div className="flex flex-col gap-y-4 justify-center w-full">
            {listaSectores && listaSectores.length > 0 ? (
              listaSectores.map((elementos, index) => (
                <figure
                  key={index}
                  className="flex flex-row justify-between w-full border border-gray-200 rounded-md p-4 shadow-md items-center transition-colors">
                  <div className="flex flex-row w-full justify-between items-center">
                    <div>
                      <h2 className="mb-2 font-medium">Nombre Grupo: {elementos.nombre}</h2>
                      <p className="text-xs text-gray-500">Detalles: {`${elementos.descripcion}`}</p>
                    </div>
                    <div className="flex flex-row items-center gap-x-4">
                      <div>
                        <Tooltip title="eliminar del grupo">
                          <span>
                            <IconButton
                              onClick={() => {
                                eliminarGrupo(elementos);
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <Delete color="error" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </figure>
              ))
            ) : (
              <p>No se Encontraron Tickets</p>
            )}
          </div>
        }
      />
      <Sliders
        nameSlider="sectoresSinAgregar"
        titleSlider="Sectores sin agregar"
        expandend={expandend}
        setExpanded={setExpanded}
        setOpcionSlider={setOpcionSlider}
        elementJSX={
          <div className="flex flex-col gap-y-4 justify-center w-full">
            {listaSectoresSinGrupo && listaSectoresSinGrupo.length > 0 ? (
              listaSectoresSinGrupo.map((elementos, index) => (
                <figure
                  key={index}
                  className="flex flex-row justify-between w-full border border-gray-200 rounded-md p-4 shadow-md items-center transition-colors">
                  <div className="flex flex-row w-full justify-between items-center">
                    <div>
                      <h2 className="mb-2 font-medium">Nombre Grupo: {elementos.nombre}</h2>
                      <p className="text-xs text-gray-500">Detalles: {`${elementos.descripcion}`}</p>
                    </div>
                    <div className="flex flex-row items-center gap-x-4">
                      <div>
                        <Tooltip title="Añadir al grupo">
                          <span>
                            <IconButton
                              onClick={() => {
                                añadirGrupo(elementos);
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <Add color="success" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </figure>
              ))
            ) : (
              <p>No se Encontraron Tickets</p>
            )}
          </div>
        }
      />
    </main>
  );
};
