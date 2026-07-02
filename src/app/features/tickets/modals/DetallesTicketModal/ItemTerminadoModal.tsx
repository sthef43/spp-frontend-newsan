import { CheckRounded } from "@mui/icons-material";
import { Button } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { useAppDispatch } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import FetchApi from "app/shared/helpers/FetchApi";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState } from "react";
import { ITicketsItemsProcesosResultados } from "../../models/ITicketsItemsProcesosResultados";
import { ITicketsTrazabilidad } from "../../models/ITicketsTrazabilidad";
import { TicketsItemsProcesosResultadosSliceRequest } from "../../reducers/TicketsItemsProcesosResultadosSlice";
import { TicketsTrazabilidadSliceRequest } from "../../reducers/TicketsTrazabilidadSlice";

interface Props {
  openModal: boolean;
  setOpenModal: (newValue: boolean) => void;
  itemTerminado: ITicketsItemsProcesosResultados;
  setItemProcesos: (newValue: ITicketsItemsProcesosResultados[]) => void;
  listaItems: ITicketsItemsProcesosResultados[];
  trazaGenerada: ITicketsTrazabilidad;
  opcionGeneracion?: (
    opcionAccion: "Estado" | "Aprobacion" | "Item Terminado" | "Solucion Rechazada" | "Rechazar Solucion en Grupo"
  ) => ITicketsTrazabilidad;
}

// eslint-disable-next-line unused-imports/no-unused-vars
export const ItemTerminadoModal: React.FC<Props> = ({
  openModal,
  setOpenModal,
  itemTerminado,
  setItemProcesos,
  listaItems,
  trazaGenerada,
  opcionGeneracion
}) => {
  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { FetchPut } = useFetchApiMultiResults<ITicketsItemsProcesosResultados[] | ITicketsItemsProcesosResultados>();

  const [itemsConListaDeBaja, setItemsConListaDeBaja] = useState<ITicketsItemsProcesosResultados>();
  FetchApi<ITicketsItemsProcesosResultados>(
    TicketsItemsProcesosResultadosSliceRequest.GetItemResultadoById,
    { itemId: itemTerminado.id, ticketId: itemTerminado.ticketsId },
    false,
    openModal,
    setItemsConListaDeBaja,
    true
  );

  const fechaFormateada = (fechaTickets: ITicketsItemsProcesosResultados) => {
    const fechaFormatModified = new Date(fechaTickets.lastModifiedDate);
    if (fechaFormatModified) {
      return `${fechaFormatModified.getFullYear()}-${
        fechaFormatModified.getMonth() + 1
      }-${fechaFormatModified.getDate()} ${fechaFormatModified.getHours()}:${fechaFormatModified.getMinutes()}`;
    } else {
      return `Sin Fecha`;
    }
  };

  const darBajaAprobacion = () => {
    const itemActualizado = actualizarItem(itemTerminado);
    FetchPut({
      consoleLog: false,
      modelPut: itemActualizado,
      sliceRequest: TicketsItemsProcesosResultadosSliceRequest.PutRequest,
      activeConfirmation: true,
      mensajePersonalizado: true,
      titleUser: "Dar de Baja Aprobacion",
      messageUser: "Se dara de baja la aprobacion del item seleccionado",
      functionAdd: async () => {
        const responseItems = unwrapResult(
          await dispatch(TicketsItemsProcesosResultadosSliceRequest.GetAllItemsByTicketId(itemTerminado.ticketsId))
        );
        await dispatch(TicketsTrazabilidadSliceRequest.PostRequest(trazaGenerada));
        setItemProcesos(responseItems);
        setOpenModal(false);
      }
    });
  };

  const darBajaAprobacionMulti = () => {
    const nuevaTraza = opcionGeneracion("Rechazar Solucion en Grupo");
    const { arraySinElementosSeleccionado, arrayConElementoSeleccionado } = generarLista();
    const listaNombresItems = arraySinElementosSeleccionado.map((elementos) => {
      return elementos.nombre;
    });
    const formatTrazabilidad = {
      ...nuevaTraza,
      mensajeAccion: nuevaTraza.mensajeAccion + listaNombresItems.join(", ")
    };
    FetchPut({
      consoleLog: false,
      modelPut: arrayConElementoSeleccionado,
      sliceRequest: TicketsItemsProcesosResultadosSliceRequest.multiPutRequest,
      activeConfirmation: true,
      mensajePersonalizado: true,
      titleUser: "Dar de Baja la Lista Aprobacion",
      messageUser: `Se daran de baja los siguiente items: ${listaNombresItems.join(", ")}`,
      functionAdd: async (response) => {
        if (response) {
          const responseItems = unwrapResult(
            await dispatch(TicketsItemsProcesosResultadosSliceRequest.GetAllItemsByTicketId(itemTerminado.ticketsId))
          );
          await dispatch(TicketsTrazabilidadSliceRequest.PostRequest(formatTrazabilidad));
          setItemProcesos(responseItems);
          setOpenModal(false);
        }
      }
    });
  };

  const actualizarItem = (itemParaActualizar: ITicketsItemsProcesosResultados) => {
    try {
      const actualizacion: ITicketsItemsProcesosResultados = {
        ...itemParaActualizar,
        aprobadoCliente: "Desaprobado",
        comentarioAprobado: "",
        estadoAprobado: false,
        operatorId: 0
      };

      if (actualizacion !== null) {
        return actualizacion;
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(`Se genero un error intenando generar la nueva actualizacion: ${error}`, "error");
    }
  };

  const generarLista = () => {
    try {
      const arrayNew: ITicketsItemsProcesosResultados[] = [];
      const arrayItemsBaja: ITicketsItemsProcesosResultados[] = [];

      const buscarItemsDiponibles = itemsConListaDeBaja.ticketsItemsProcesos.ticketsItemsProcesosBloques.flatMap(
        (elementos) => elementos.ticketsItemsProcesosBajaId
      );
      const filtrarItemsPermitidos = listaItems.filter((e) => buscarItemsDiponibles.includes(e.ticketsItemsProcesosId));

      const clonItemSeleccionado: ITicketsItemsProcesosResultados = {
        ...itemTerminado,
        estadoAprobado: false,
        aprobadoCliente: null,
        comentarioAprobado: "",
        operatorId: 0
      };
      delete clonItemSeleccionado.operator;
      delete clonItemSeleccionado.rol;
      arrayNew.push(clonItemSeleccionado);

      filtrarItemsPermitidos.forEach((elementos) => {
        const clonItem: ITicketsItemsProcesosResultados = {
          ...elementos,
          comentarioAprobado: "",
          estadoAprobado: false,
          aprobadoCliente: null,
          operatorId: 0
        };
        delete clonItem.operator;
        delete clonItem.rol;
        arrayNew.push(clonItem);
        arrayItemsBaja.push(clonItem);
      });

      if (arrayNew.length > 0) {
        return {
          arrayConElementoSeleccionado: arrayNew,
          arraySinElementosSeleccionado: arrayItemsBaja
        };
      }
    } catch (error) {
      console.log(error);
      openNotificationUI("Se genero un error generando la lista para dar de baja la aprobacion", "error");
    }
  };

  return (
    <>
      {itemTerminado && (
        <main
          className={`${itemsConListaDeBaja && itemsConListaDeBaja.ticketsItemsProcesos ? "w-[35vw]" : "w-[25vw]"}`}>
          <section className="flex flex-col w-full">
            <figure className="flex justify-center my-4">
              <CheckRounded color="success" sx={{ fontSize: "7rem" }} />
            </figure>
            <div className="flex flex-col my-2 gap-y-3">
              <p>
                <span className="font-semibold">Comentario de aprobacion</span>: {itemTerminado.comentarioAprobado}
              </p>
              <p>
                <span className="font-semibold">Persona que dio aprobacion:</span> {itemTerminado.operator.name}{" "}
                {itemTerminado.operator.surname}
              </p>
              <p>
                <span className="font-semibold">Rol de la persona:</span> {itemTerminado.rol.name.trim()}
              </p>
              <p>
                <span className="font-semibold">Comentario de aprobacion:</span> {fechaFormateada(itemTerminado)}
              </p>
            </div>
            <div className="w-full flex gap-x-4 justify-center mt-4">
              <Button
                onClick={() => {
                  setOpenModal(false);
                }}
                className={buttonClases.blueButton}
                variant="contained">
                Cerrar
              </Button>
              {itemsConListaDeBaja && itemsConListaDeBaja.ticketsItemsProcesos && (
                <>
                  <Button
                    onClick={() => {
                      darBajaAprobacionMulti();
                    }}
                    variant="contained"
                    className={buttonClases.purpleButton}>
                    Cancelar Grupo
                  </Button>
                </>
              )}
              <Button
                className={buttonClases.redButton}
                onClick={() => {
                  darBajaAprobacion();
                }}
                variant="contained">
                Cancelar Aprobacion
              </Button>
            </div>
          </section>
        </main>
      )}
    </>
  );
};
