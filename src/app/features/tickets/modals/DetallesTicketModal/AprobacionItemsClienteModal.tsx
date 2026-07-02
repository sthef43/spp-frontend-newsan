/* eslint-disable unused-imports/no-unused-vars */
import React, { useState } from "react";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { ITicketsItemsProcesosResultados } from "../../models/ITicketsItemsProcesosResultados";
import { Box, Button, Paper, Step, StepContent, StepLabel, Stepper, Typography } from "@mui/material";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { unwrapResult } from "@reduxjs/toolkit";
import { ITickets } from "../../models/ITickets";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { IAppUser } from "app/models";
import FetchApi from "app/shared/helpers/FetchApi";
import { ITicketsItemsProcesosBloque } from "../../models/ITicketsItemsProcesosBloque";
import { ITicketsTrazabilidad } from "../../models/ITicketsTrazabilidad";
import { TicketsItemsProcesosResultadosSliceRequest } from "../../reducers/TicketsItemsProcesosResultadosSlice";
import { TicketsSliceRequest } from "../../reducers/TicketsSlice";
import { TicketsTrazabilidadSliceRequest } from "../../reducers/TicketsTrazabilidadSlice";

interface Props {
  setOpenModal: (newValue: boolean) => void;
  openModal: boolean;
  setListaItemsSolucionados: (newValue: ITicketsItemsProcesosResultados[]) => void;
  ticketSeleccionado: ITickets;
  setOpenModalDetallesTicket: (newValue: boolean) => void;
  setTicketSeleecionado: (newValue: ITickets) => void;
  opcionGeneracion?: (
    opcionAccion: "Estado" | "Aprobacion" | "Item Terminado" | "Solucion Rechazada" | "Rechazar Solucion en Grupo",
    itemActual?: ITicketsItemsProcesosResultados,
    itemSeleccionado?: ITicketsItemsProcesosResultados
  ) => ITicketsTrazabilidad;
}

export const AprobacionItemsClienteModal: React.FC<Props> = ({
  setOpenModal,
  openModal,
  setListaItemsSolucionados,
  ticketSeleccionado,
  setOpenModalDetallesTicket,
  setTicketSeleecionado,
  opcionGeneracion
}) => {
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  const [listaItems, setListaItems] = useState<ITicketsItemsProcesosResultados[]>([]);
  FetchApi<ITicketsItemsProcesosResultados[]>(
    TicketsItemsProcesosResultadosSliceRequest.GetAllItemsByTicketIdForApproval,
    ticketSeleccionado.id,
    false,
    openModal,
    setListaItems,
    true
  );

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const buttonClases = MaterialButtons();
  const { FetchPut } = useFetchApiMultiResults();

  const actualizarTicket = async () => {
    const actualizacionEstadoTicket = cambiarEstadoTicket(4);
    FetchPut({
      sliceRequest: TicketsSliceRequest.PutRequest,
      consoleLog: false,
      modelPut: actualizacionEstadoTicket,
      activeConfirmation: true,
      mensajePersonalizado: true,
      titleUser: "Cerrar Ticket Como Aprobado",
      messageUser: "Desea cerrar el ticket y darlo como aprobado?",
      functionAdd: async () => {
        await dispatch(TicketsSliceRequest.PutRequest(actualizacionEstadoTicket));
        await dispatch(EmailSliceRequest.SendEmailStateTicket(actualizacionEstadoTicket));
        await dispatch(TicketsSliceRequest.getByIdRequest(actualizacionEstadoTicket.id));
        openNotificationUI("Se cerro el ticket con exito", "success");
        setOpenModal(false);
        setOpenModalDetallesTicket(false);
      }
    });
  };

  const aprobarSolucion = (item: ITicketsItemsProcesosResultados, tipoActualizacion: string) => {
    const nuevoItem = actualizarItem(item, tipoActualizacion);
    const actualizacionEstadoTicket = cambiarEstadoTicket(tipoActualizacion === "Aprobado" ? 5 : 3);
    FetchPut({
      sliceRequest: TicketsItemsProcesosResultadosSliceRequest.PutRequest,
      consoleLog: false,
      modelPut: nuevoItem,
      activeConfirmation: true,
      mensajePersonalizado: true,
      titleUser: tipoActualizacion === "Aprobado" ? "Aprobar Solucion" : "No Aprobar Solucion",
      messageUser:
        tipoActualizacion === "Aprobado"
          ? "Quiere dar por aprobado el item?"
          : "Quiere dar por desaprobado la solucion del item",
      functionAdd: async () => {
        const nuevaTraza = opcionGeneracion("Solucion Rechazada", null, item);
        openNotificationUI(
          `${tipoActualizacion === "Aprobado" ? "La solucion se dio por aprobada" : "La solucion se desaprobo"}`,
          "success"
        );
        const responseItems = unwrapResult(
          await dispatch(
            TicketsItemsProcesosResultadosSliceRequest.GetAllItemsByTicketIdForApproval(ticketSeleccionado.id)
          )
        );
        const responseTicket = unwrapResult(await dispatch(TicketsSliceRequest.PutRequest(actualizacionEstadoTicket)));
        if (responseTicket) {
          const responseTicketById = unwrapResult(
            await dispatch(TicketsSliceRequest.GetTicketById(actualizacionEstadoTicket.id))
          );
          await dispatch(TicketsTrazabilidadSliceRequest.PostRequest(nuevaTraza));
          setTicketSeleecionado(responseTicketById);
        }
        setListaItemsSolucionados(responseItems);
        setListaItems(responseItems);
      }
    });
  };

  const darBajaAprobacionMulti = (
    elementosBloques: ITicketsItemsProcesosBloque[],
    itemSeleccionado: ITicketsItemsProcesosResultados
  ) => {
    const nuevaTraza = opcionGeneracion("Rechazar Solucion en Grupo");
    const actualizacionEstadoTicket = cambiarEstadoTicket(3);
    const { arraySinElementosSeleccionado, arrayConElementoSeleccionado } = generarItemRechazo(
      elementosBloques,
      itemSeleccionado
    );
    const listaNombresItems = arrayConElementoSeleccionado.map((elementos) => {
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
      functionAdd: async () => {
        const responseItems = unwrapResult(
          await dispatch(
            TicketsItemsProcesosResultadosSliceRequest.GetAllItemsByTicketIdForApproval(ticketSeleccionado.id)
          )
        );
        const responseTicket = unwrapResult(await dispatch(TicketsSliceRequest.PutRequest(actualizacionEstadoTicket)));
        if (responseTicket) {
          const response = unwrapResult(await dispatch(TicketsSliceRequest.GetTicketById(ticketSeleccionado.id)));
          setTicketSeleecionado(response);
          await dispatch(TicketsTrazabilidadSliceRequest.PostRequest(formatTrazabilidad));
        }
        setListaItemsSolucionados(responseItems);
        setOpenModal(false);
      }
    });
  };

  const actualizarItem = (itemParaActualizar: ITicketsItemsProcesosResultados, tipoActualizacion: string) => {
    try {
      const actualizacion: ITicketsItemsProcesosResultados = {
        ...itemParaActualizar,
        aprobadoCliente: tipoActualizacion === "Aprobado" ? "Aprobado" : "Desaprobado",
        comentarioAprobado: tipoActualizacion === "Desaprobado" ? "" : itemParaActualizar.comentarioAprobado,
        estadoAprobado: tipoActualizacion === "Aprobado" ? true : false,
        operatorId: tipoActualizacion === "Aprobado" ? itemParaActualizar.operatorId : 0,
        aprobacionIntermedia:
          tipoActualizacion === "Desaprobado" && itemParaActualizar.mensajeAprobacion !== "" ? true : false
      };

      delete actualizacion.operator;
      delete actualizacion.rol;
      delete actualizacion.ticketsItemsProcesos;

      if (actualizacion !== null) {
        return actualizacion;
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(`Se genero un error intenando generar la nueva actualizacion: ${error}`, "error");
    }
  };

  const cambiarEstadoTicket = (estadoId: number) => {
    const ticketFormateado = {
      ...ticketSeleccionado,
      ticketsEstadoId: estadoId,
      responsableOperatorId: infoUser.operatorId
    };
    delete ticketFormateado.operator;
    delete ticketFormateado.ticketsCategoria;
    delete ticketFormateado.ticketsEstado;
    delete ticketFormateado.responsableOperator;
    delete ticketFormateado.ticketsColaboradoresBloque;
    delete ticketFormateado.ticketsItemsProcesosResultado;
    return ticketFormateado;
  };

  const generarItemRechazo = (
    elementosBloques: ITicketsItemsProcesosBloque[],
    itemSeleccionado: ITicketsItemsProcesosResultados
  ) => {
    try {
      const arrayNew: ITicketsItemsProcesosResultados[] = [];
      const itemsIdBaja = elementosBloques.map((elementos) => elementos.ticketsItemsProcesosBajaId);
      const buscarItemsResultados = listaItems.filter((elementos) =>
        itemsIdBaja.includes(elementos.ticketsItemsProcesosId)
      );
      const clonItemSeleccionado: ITicketsItemsProcesosResultados = {
        ...itemSeleccionado,
        estadoAprobado: false,
        aprobadoCliente: null,
        comentarioAprobado: "Desaprobado"
      };
      delete clonItemSeleccionado.operator;
      delete clonItemSeleccionado.rol;
      arrayNew.push(clonItemSeleccionado);
      buscarItemsResultados.forEach((elementos) => {
        const clonItem: ITicketsItemsProcesosResultados = {
          ...elementos,
          comentarioAprobado: "Desaprobado",
          estadoAprobado: false,
          aprobadoCliente: null
        };
        delete clonItem.ticketsItemsProcesos;
        delete clonItem.operator;
        delete clonItem.rol;
        arrayNew.push(clonItem);
      });
      if (arrayNew.length > 0) {
        return {
          arrayConElementoSeleccionado: arrayNew,
          arraySinElementosSeleccionado: buscarItemsResultados
        };
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(`Se genero un error generando la lista de items para rechazar: ${error}`, "error");
    }
  };

  return (
    <main className="w-[45vw] flex flex-col items-center">
      <Box sx={{ maxWidth: "100%" }}>
        <Stepper orientation="vertical">
          {listaItems.map((elementos, index) => {
            let completo = false;
            const stepProps: { completed?: boolean } = {};
            const labelProps: { error?: boolean } = {};
            if (elementos.aprobadoCliente === "Aprobado") {
              stepProps.completed = true;
              labelProps.error = false;
              completo = true;
            }
            if (elementos.aprobadoCliente === "Desaprobado") {
              stepProps.completed = true;
              labelProps.error = true;
              completo = false;
            }
            return (
              <Step key={elementos.id} {...stepProps}>
                <StepLabel
                  className={`${
                    completo ? "hover:underline cursor-pointer hover:text-blue-400 transition-all duration-300" : ""
                  }`}
                  {...labelProps}
                  optional={
                    index === listaItems.length - 1 ? (
                      <Typography variant="caption">Ultima Aprobacion</Typography>
                    ) : null
                  }>
                  {elementos.nombre}
                </StepLabel>
                <StepContent TransitionProps={{ in: true, unmountOnExit: false }}>
                  <Typography>{elementos.comentarioAprobado}</Typography>
                  <Box sx={{ display: "flex", flexDirection: "row", gap: 1, justifyContent: "start" }}>
                    <Button
                      disabled={elementos.comentarioAprobado === ""}
                      onClick={() => {
                        aprobarSolucion(elementos, "Aprobado");
                      }}
                      className={buttonClases.blueButton}
                      sx={{ mt: 2, mr: 1 }}
                      variant="contained">
                      Aprobar
                    </Button>
                    <Button
                      onClick={() => {
                        aprobarSolucion(elementos, "Desaprobado");
                      }}
                      sx={{ mt: 2, mr: 1 }}
                      className={buttonClases.redButton}
                      variant="contained">
                      Desaprobar
                    </Button>
                    {elementos.ticketsItemsProcesos &&
                      elementos.ticketsItemsProcesos.ticketsItemsProcesosBloques.length > 0 && (
                        <Button
                          onClick={() => {
                            darBajaAprobacionMulti(
                              elementos.ticketsItemsProcesos.ticketsItemsProcesosBloques,
                              elementos
                            );
                          }}
                          sx={{ mt: 2, mr: 1 }}
                          className={buttonClases.purpleButton}
                          variant="contained">
                          Desaprobar Grupo
                        </Button>
                      )}
                  </Box>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        {!listaItems.find(
          (elementos) => elementos.aprobadoCliente === null || elementos.aprobadoCliente === "Desaprobado"
        ) && (
          <Paper square elevation={0} sx={{ mt: 3 }}>
            <Typography>Todas las soluciones fueron aprobadas</Typography>
            <Button
              onClick={() => {
                actualizarTicket();
              }}
              variant="contained"
              className={buttonClases.blueButton}
              sx={{ mt: 1, mr: 1 }}>
              Cerrar Ticket
            </Button>
          </Paper>
        )}
      </Box>
    </main>
  );
};
