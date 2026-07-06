import { Add, Delete, Edit } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import FetchApi from "app/shared/helpers/FetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState } from "react";
import { ITicketsGrupoProcesos } from "../../../models/iTicketsGrupoProcesos";
import { ITicketsGrupoProcesosBloque } from "../../../models/ITicketsGrupoProcesosBloque";
import { ITicketsItemsProcesos } from "../../../models/ITicketsItemsProcesos";
import { TicketGrupoProcesosBloqueSliceRequest } from "app/features/tickets/reducers/TicketsGrupoProcesosBloqueSlice";
import { TicketsItemsProcesosSliceRequest } from "app/features/tickets/reducers/TicketsItemsProcesos";
import { CambiarPositionItem } from "./CambiarPositionItem";
import { Sliders } from "app/features/ayuda/components/Sliders";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  grupoProcesos: ITicketsGrupoProcesos;
}

// eslint-disable-next-line unused-imports/no-unused-vars
export const AgregarItemsGrupoModal: React.FC<Props> = ({ setOpenModal, openModal, grupoProcesos }) => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const [expandend, setExpanded] = useState<string | false>(false);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [opcionSlider, setOpcionSlider] = useState<string>("Agregar");

  const [listadoItemsSinAsignar, setListadoItemsSinAsignar] = useState<ITicketsItemsProcesos[]>([]);
  FetchApi<ITicketsItemsProcesos[]>(
    TicketsItemsProcesosSliceRequest.GetAllItemsWithoutGroup,
    { grupoId: grupoProcesos.id, categoriaId: grupoProcesos.ticketsCategoriasId },
    false,
    openModal,
    setListadoItemsSinAsignar
  );

  const [listadoItemsAñadidos, setListadoItemsAñadidos] = useState<ITicketsItemsProcesos[]>([]);
  FetchApi<ITicketsItemsProcesos[]>(
    TicketsItemsProcesosSliceRequest.GetAllWithGroup,
    grupoProcesos.id,
    false,
    openModal,
    setListadoItemsAñadidos
  );

  const [listaBloques, setListaBloques] = useState<ITicketsGrupoProcesosBloque[]>([]);
  FetchApi<ITicketsGrupoProcesosBloque[]>(
    TicketGrupoProcesosBloqueSliceRequest.GetAllWithGrupoId,
    grupoProcesos.id,
    true,
    openModal,
    setListaBloques,
    true
  );

  const eliminarItemGrupo = async (elementos: ITicketsItemsProcesos) => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const responseEliminar = unwrapResult(
        await dispatch(
          TicketGrupoProcesosBloqueSliceRequest.DeleteBloqByItemAndGrupoId({
            itemId: elementos.id,
            grupoId: grupoProcesos.id
          })
        )
      );
      if (responseEliminar) {
        openNotificationUI("Se elimino el Item con exito", "success");
        const responseRefresh = unwrapResult(
          await dispatch(TicketsItemsProcesosSliceRequest.GetAllWithGroup(grupoProcesos.id))
        );
        const responseRefreshOutGroup = unwrapResult(
          await dispatch(
            TicketsItemsProcesosSliceRequest.GetAllItemsWithoutGroup({
              categoriaId: grupoProcesos.ticketsCategoriasId,
              grupoId: grupoProcesos.id
            })
          )
        );
        const refreshBloque = unwrapResult(
          await dispatch(TicketGrupoProcesosBloqueSliceRequest.GetAllWithGrupoId(grupoProcesos.id))
        );
        if (responseRefresh) {
          setListadoItemsAñadidos(responseRefresh);
          setListadoItemsSinAsignar(responseRefreshOutGroup);
          setListaBloques(refreshBloque);
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const añadirItemGrupo = async (elementos: ITicketsItemsProcesos) => {
    const nuevoBloque: ITicketsGrupoProcesosBloque = {
      ticketsGrupoProcesosId: grupoProcesos.id,
      ticketsItemsProcesosId: elementos.id,
      position: 0
    };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const responseAñadir = unwrapResult(
        await dispatch(TicketGrupoProcesosBloqueSliceRequest.PostRequest(nuevoBloque))
      );
      if (responseAñadir) {
        openNotificationUI("Se agrego el item con exito", "success");
        const responseRefresh = unwrapResult(
          await dispatch(
            TicketsItemsProcesosSliceRequest.GetAllItemsWithoutGroup({
              categoriaId: grupoProcesos.ticketsCategoriasId,
              grupoId: grupoProcesos.id
            })
          )
        );
        const responseRefreshWithGroup = unwrapResult(
          await dispatch(TicketsItemsProcesosSliceRequest.GetAllWithGroup(grupoProcesos.id))
        );
        const refreshBloque = unwrapResult(
          await dispatch(TicketGrupoProcesosBloqueSliceRequest.GetAllWithGrupoId(grupoProcesos.id))
        );
        if (responseRefresh) {
          setListadoItemsSinAsignar(responseRefresh);
          setListadoItemsAñadidos(responseRefreshWithGroup);
          setListaBloques(refreshBloque);
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [openModalEditarPosition, setOpenModalEditarPosition] = useState(false);
  const [itemSeleccionado, setItemSeleccionado] = useState<ITicketsItemsProcesos>();
  const handleOpenModalEditarPosition = (item: ITicketsItemsProcesos) => {
    setItemSeleccionado(item);
    setOpenModalEditarPosition(true);
  };

  return (
    <main className="w-[60vw]">
      <section className="flex flex-col gap-y-4 w-full">
        <Sliders
          nameSlider="itemsAgregados"
          titleSlider="Items Agregados"
          expandend={expandend}
          setExpanded={setExpanded}
          setOpcionSlider={setOpcionSlider}
          elementJSX={
            <div className="flex flex-col gap-y-4 justify-center w-full">
              {listadoItemsAñadidos && listadoItemsAñadidos.length > 0 ? (
                listadoItemsAñadidos.map((elementos, index) => {
                  const bloqueItem = listaBloques.find((bloque) => bloque.ticketsItemsProcesosId == elementos.id);
                  return (
                    <figure
                      key={index}
                      className="flex flex-row justify-between w-full border border-gray-200 rounded-md p-4 shadow-md items-center transition-colors">
                      <div className="flex flex-row w-full justify-between items-center">
                        <div>
                          <div className="flex flex-row gap-x-4 items-center">
                            {bloqueItem && (
                              <p className="rounded-lg px-4 py-2 bg-primaryNew text-white">{bloqueItem.position}</p>
                            )}
                            <div>
                              <h2 className="mb-2 font-medium">Nombre Item: {elementos.nombre}</h2>
                              <p className="text-xs text-gray-500">Detalles: {`${elementos.detalles}`}</p>
                              <p className="text-xs text-gray-500">Rol: {`${elementos.rol.name}`}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-row items-center gap-x-4">
                          <div>
                            <Tooltip title="Eliminar Item">
                              <span>
                                <IconButton
                                  onClick={() => {
                                    eliminarItemGrupo(elementos);
                                  }}
                                  size="small"
                                  style={{ position: "relative" }}>
                                  <Delete color="warning" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </div>
                          <div>
                            <Tooltip title="Editar Posicion">
                              <span>
                                <IconButton
                                  onClick={() => {
                                    handleOpenModalEditarPosition(elementos);
                                  }}
                                  size="small"
                                  style={{ position: "relative" }}>
                                  <Edit color="primary" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </figure>
                  );
                })
              ) : (
                <p>No se Encontraron Items</p>
              )}
            </div>
          }
        />
        <Sliders
          nameSlider="agregarItems"
          titleSlider="Agregar Items"
          expandend={expandend}
          setExpanded={setExpanded}
          setOpcionSlider={setOpcionSlider}
          elementJSX={
            <div className="flex flex-col gap-y-4 justify-center w-full">
              {listadoItemsSinAsignar && listadoItemsSinAsignar.length > 0 ? (
                listadoItemsSinAsignar.map((elementos, index) => (
                  <figure
                    key={index}
                    className="flex flex-row justify-between w-full border border-gray-200 rounded-md p-4 shadow-md items-center transition-colors">
                    <div className="flex flex-row w-full justify-between items-center">
                      <div>
                        <h2 className="mb-2 font-medium">Nombre Grupo: {elementos.nombre}</h2>
                        <p className="text-xs text-gray-500">Detalles: {`${elementos.detalles}`}</p>
                        <p className="text-xs text-gray-500">Rol: {`${elementos.rol.name}`}</p>
                      </div>
                      <div className="flex flex-row items-center gap-x-4">
                        <div>
                          <Tooltip title="Añadir al grupo">
                            <span>
                              <IconButton
                                onClick={() => {
                                  añadirItemGrupo(elementos);
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
                <p>No se Encontraron Items</p>
              )}
            </div>
          }
        />
      </section>
      <ModalCompoment
        openPopup={openModalEditarPosition}
        setOpenPopup={setOpenModalEditarPosition}
        title="Editar posicion">
        <CambiarPositionItem
          setListadoBloques={setListaBloques}
          setListadoItems={setListadoItemsAñadidos}
          grupoProcesos={grupoProcesos}
          itemSeleccionado={itemSeleccionado}
          openModal={openModalEditarPosition}
          setOpenModal={setOpenModalEditarPosition}
        />
      </ModalCompoment>
    </main>
  );
};
