import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch } from "app/core/store/store";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import { useForm } from "react-hook-form";
import { ITicketsItemsProcesos } from "../../models/ITicketsItemsProcesos";
import { IconButton, Tooltip } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { ITicketsItemsProcesosBloque } from "../../models/ITicketsItemsProcesosBloque";
import FetchApi from "app/shared/helpers/FetchApi";
import { unwrapResult } from "@reduxjs/toolkit";
import { TicketsItemsProcesosBloquesSliceRequest } from "../../reducers/TicketsItemsProcesosBloquesSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  listaItems: ITicketsItemsProcesos[];
  itemSeleccionado: ITicketsItemsProcesos;
}

export const AñadirItemsParaCancelacionModal: React.FC<Props> = ({
  setOpenModal,
  openModal,
  listaItems,
  itemSeleccionado
}) => {
  const { control } = useForm();

  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();
  const { TitleChanger } = useTitleOfApp();
  const { FetchPost, FetchDelete } = useFetchApiMultiResults();

  const [itemsAñadidos, setItemsAñadidos] = useState<ITicketsItemsProcesosBloque[]>([]);
  FetchApi<ITicketsItemsProcesosBloque[]>(
    TicketsItemsProcesosBloquesSliceRequest.GetAllItemsByAddInBloq,
    itemSeleccionado.id,
    false,
    openModal,
    setItemsAñadidos,
    true
  );

  const añadirBloque = (elemento: ITicketsItemsProcesos) => {
    const nuevoBloque = generarBloqueDesaprobacion(elemento);
    FetchPost(TicketsItemsProcesosBloquesSliceRequest.PostRequest, nuevoBloque, false, async () => {
      const response = unwrapResult(
        await dispatch(TicketsItemsProcesosBloquesSliceRequest.GetAllItemsByAddInBloq(itemSeleccionado.id))
      );
      setItemsAñadidos(response);
      openNotificationUI("Se agrego con exito el nuevo item", "info");
    });
  };

  const eliminarBloque = (itemId: number) => {
    const buscarBloque = itemsAñadidos.find((elementos) => elementos.ticketsItemsProcesosBajaId === itemId);
    const clonBloque = { ...buscarBloque };
    delete clonBloque.ticketsItemsProcesosBaja;
    FetchDelete({
      consoleLog: false,
      deleteId: clonBloque.id,
      sliceRequest: TicketsItemsProcesosBloquesSliceRequest.deleteRequest,
      mensajePersonalizado: true,
      titleUser: "Eliminar Item de Desaprobacion",
      messageUser: "Seguro que desea eliminar el item de desaprobacion de la lista?",
      functionAdd: async () => {
        const response = unwrapResult(
          await dispatch(TicketsItemsProcesosBloquesSliceRequest.GetAllItemsByAddInBloq(itemSeleccionado.id))
        );
        setItemsAñadidos(response);
        openNotificationUI("Se elimino correctamente el item", "success");
      }
    });
  };

  const generarBloqueDesaprobacion = (elemento: ITicketsItemsProcesos) => {
    try {
      const nuevoBloque: ITicketsItemsProcesosBloque = {
        ticketsItemsProcesosId: itemSeleccionado.id,
        ticketsItemsProcesosBajaId: elemento.id
      };
      return nuevoBloque;
    } catch (error) {
      console.log(error);
      openNotificationUI(`Se genero un error intentando genernar el nuevo bloque: ${error}`, "error");
    }
  };

  return (
    <main className="w-[60vw]">
      {listaItems && listaItems.length > 0 && (
        <section className="flex flex-col gap-y-4">
          {listaItems.map((elementos, index) => {
            const buscarItem = itemsAñadidos.some((items) => {
              return items.ticketsItemsProcesosBajaId === elementos.id;
            });
            return (
              <figure
                key={index}
                className={`${
                  elementos.id === itemSeleccionado.id ? "hidden" : "flex"
                } flex-row justify-between w-full border border-gray-200 rounded-md p-4 shadow-md items-center transition-colors`}>
                <div className="flex flex-row w-full justify-between items-center">
                  <div>
                    <h2 className="mb-2 font-medium">Nombre Item: {elementos.nombre}</h2>
                  </div>
                  <div className="flex flex-row items-center gap-x-4">
                    <div>
                      {!buscarItem ? (
                        <Tooltip title="Añadir item">
                          <span>
                            <IconButton
                              onClick={() => {
                                añadirBloque(elementos);
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <Add color="primary" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Eliminar Item">
                          <span>
                            <IconButton
                              onClick={() => {
                                eliminarBloque(elementos.id);
                              }}
                              size="small"
                              style={{ position: "relative" }}>
                              <Delete color="error" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                </div>
              </figure>
            );
          })}
        </section>
      )}
    </main>
  );
};
