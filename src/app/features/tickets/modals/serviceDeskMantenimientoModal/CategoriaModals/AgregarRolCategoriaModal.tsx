/* eslint-disable unused-imports/no-unused-vars */
import FetchApi from "app/shared/helpers/FetchApi";
import React, { useState } from "react";
import { ITicketsCategoria } from "../../../models/ITicketsCategorias";
import { IRol } from "app/models";
import { useAppDispatch } from "app/core/store/store";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { IconButton, Tooltip } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { ITicketsCategoriasRolBloque } from "../../../models/ITicketsCategoriasRolBloque";
import { Sliders } from "app/features/ayuda/components/Sliders";
import { TicketCategoriaRolBloqueSliceRequets } from "app/features/tickets/reducers/TicketsCategoriaRolBloqueSlice";
import { TicketsCategoriaSliceRequest } from "app/features/tickets/reducers/TicketsCategoriaSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  categoriaSeleccionada: ITicketsCategoria;
}

export const AgregarRolCategoriaModal: React.FC<Props> = ({ setOpenModal, openModal, categoriaSeleccionada }) => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [expandend, setExpanded] = useState<string | false>(false);
  const [opcionSlider, setOpcionSlider] = useState<string>("Agregar");

  const [rolesAsignados, setRolesAsignados] = useState<ITicketsCategoria>();
  FetchApi<ITicketsCategoria>(
    TicketsCategoriaSliceRequest.GetAllRolsWithCategorieId,
    categoriaSeleccionada.id,
    true,
    openModal,
    setRolesAsignados
  );

  const [rolesSinAsignar, setRolesSinAsignar] = useState<IRol[]>([]);
  FetchApi<IRol[]>(
    TicketsCategoriaSliceRequest.GetAllRolWithoutCategoria,
    categoriaSeleccionada.id,
    true,
    openModal,
    setRolesSinAsignar
  );

  const eliminarCategoriaRolBloque = async (elemento: ITicketsCategoriasRolBloque) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const responseEliminar = unwrapResult(
        await dispatch(
          TicketCategoriaRolBloqueSliceRequets.DeleteBloqueByRolAndCategoriaId({
            categoriaId: categoriaSeleccionada.id,
            rolId: elemento.rolId
          })
        )
      );
      if (responseEliminar) {
        openNotificationUI("Se desvinculo el rol con exito!", "success");
        const repsonseRefresh = unwrapResult(
          await dispatch(TicketsCategoriaSliceRequest.GetAllRolsWithCategorieId(categoriaSeleccionada.id))
        );
        const repsonseRefreshOutGroup = unwrapResult(
          await dispatch(TicketsCategoriaSliceRequest.GetAllRolWithoutCategoria(categoriaSeleccionada.id))
        );
        if (repsonseRefreshOutGroup) {
          setRolesAsignados(repsonseRefresh);
          setRolesSinAsignar(repsonseRefreshOutGroup);
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const añadirNuevoRol = async (elementos: IRol) => {
    const nuevoBloque: ITicketsCategoriasRolBloque = {
      ticketsCategoriasId: categoriaSeleccionada.id,
      rolId: elementos.id
    };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const responseAñadir = unwrapResult(
        await dispatch(TicketCategoriaRolBloqueSliceRequets.PostRequest(nuevoBloque))
      );
      if (responseAñadir) {
        openNotificationUI("Se agrego el nuevo rol con exito!", "success");
        const repsonseRefresh = unwrapResult(
          await dispatch(TicketsCategoriaSliceRequest.GetAllRolsWithCategorieId(categoriaSeleccionada.id))
        );
        const repsonseRefreshOutGroup = unwrapResult(
          await dispatch(TicketsCategoriaSliceRequest.GetAllRolWithoutCategoria(categoriaSeleccionada.id))
        );
        if (repsonseRefreshOutGroup) {
          setRolesAsignados(repsonseRefresh);
          setRolesSinAsignar(repsonseRefreshOutGroup);
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  return (
    <main className="w-[60vw]">
      <section className="flex flex-col gap-y-4 w-full">
        <Sliders
          nameSlider="rolAgregado"
          titleSlider="Roles agregados"
          expandend={expandend}
          setExpanded={setExpanded}
          setOpcionSlider={setOpcionSlider}
          elementJSX={
            <div className="flex flex-col gap-y-4 justify-center w-full">
              {rolesAsignados &&
              Array.isArray(rolesAsignados.ticketsCategoriaRolBloque) &&
              rolesAsignados.ticketsCategoriaRolBloque.length > 0 ? (
                rolesAsignados.ticketsCategoriaRolBloque.map((elementos, index) => (
                  <figure
                    key={index}
                    className="flex flex-row justify-between w-full border border-gray-200 rounded-md p-4 shadow-md items-center transition-colors">
                    <div className="flex flex-row w-full justify-between items-center">
                      <div>
                        <h2 className="mb-2 font-medium">Nombre Rol: {elementos.rol.name}</h2>
                      </div>
                      <div className="flex flex-row items-center gap-x-4">
                        <div>
                          <Tooltip title="Eliminar Item">
                            <span>
                              <IconButton
                                onClick={() => {
                                  eliminarCategoriaRolBloque(elementos);
                                }}
                                size="small"
                                style={{ position: "relative" }}>
                                <Delete color="warning" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </figure>
                ))
              ) : (
                <p>No se encontraron roles</p>
              )}
            </div>
          }
        />
        <Sliders
          nameSlider="rolesDisponibles"
          titleSlider="Roles disponibles"
          expandend={expandend}
          setExpanded={setExpanded}
          setOpcionSlider={setOpcionSlider}
          elementJSX={
            <div className="flex flex-col gap-y-4 justify-center w-full">
              {rolesSinAsignar && rolesSinAsignar.length > 0 ? (
                rolesSinAsignar.map((elementos, index) => (
                  <figure
                    key={index}
                    className="flex flex-row justify-between w-full border border-gray-200 rounded-md p-4 shadow-md items-center transition-colors">
                    <div className="flex flex-row w-full justify-between items-center">
                      <div>
                        <h2 className="mb-2 font-medium">Nombre Rol: {elementos.name}</h2>
                      </div>
                      <div className="flex flex-row items-center gap-x-4">
                        <div>
                          <Tooltip title="Añadir al grupo">
                            <span>
                              <IconButton
                                onClick={() => {
                                  añadirNuevoRol(elementos);
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
                <p>No se encontraron roles disponibles</p>
              )}
            </div>
          }
        />
      </section>
    </main>
  );
};
