import { Button, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { IAppUser } from "app/models";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ITickets } from "../models/ITickets";
import { ITicketsColaboradoresBloque } from "../models/ITicketsColaboradoresBloque";
import { ITicketsItemsProcesosResultados } from "../models/ITicketsItemsProcesosResultados";
import { ITicketsMensajesUsuario } from "../models/ITicketsMensajesUsuario";
import { TicketsColaboradoresBloqueSliceRequest } from "../reducers/TicketsColaboradoresBloqueSlice";
import { TicketsItemsProcesosResultadosSliceRequest } from "../reducers/TicketsItemsProcesosResultadosSlice";
import { TicketsMensajesUsuariosSliceRequets } from "../reducers/TicketsMensajesUsuariosSlice";
import FetchApi from "app/shared/helpers/FetchApi";
import { ITicketsTrazabilidad } from "../models/ITicketsTrazabilidad";
import { TicketsTrazabilidadSliceRequest } from "../reducers/TicketsTrazabilidadSlice";

interface Props {
  itemUsuario: "itemNormal" | "itemUsuario" | "";
  openModal: boolean;
  setOpenModal: (newValue: boolean) => void;
  itemAñadirValidacion: ITicketsItemsProcesosResultados;
  ticketSeleccionado: ITickets;
  refreshItems: (newValue: ITicketsItemsProcesosResultados[]) => void;
  setRefresListaColaboradores: (newValue: ITicketsColaboradoresBloque[]) => void;
  refreshMensajes: (newValue: ITicketsMensajesUsuario[]) => void;
  trazaGenerada: ITicketsTrazabilidad;
}

export const ActualizarItemsTicketModal: React.FC<Props> = ({
  itemUsuario,
  openModal,
  setOpenModal,
  itemAñadirValidacion,
  ticketSeleccionado,
  refreshItems,
  setRefresListaColaboradores,
  refreshMensajes,
  trazaGenerada
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid }
  } = useForm();

  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  const buttonClases = MaterialButtons();
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { FetchPut } = useFetchApiMultiResults();

  const [colaboradorEncontrado, setColaboradorEncontrado] = useState(null);
  FetchApi(
    TicketsColaboradoresBloqueSliceRequest.SearchColaborador,
    { colaboradorId: infoUser.operatorId, ticketId: ticketSeleccionado.id },
    false,
    openModal,
    setColaboradorEncontrado,
    true,
    false,
    true
  );

  const onSubmit = async (data) => {
    const actualizarItem = gemerarActualizacionAndMensajeAutomatico(data);
    const mensajeAutomatico = mensajeAutomaticoUsuario("validado", data);
    const mensajeFinalAutomatico = mensajeAutomaticoFunction(actualizarItem, data);
    const mensajeAviso =
      itemUsuario === "itemUsuario"
        ? "Se validara el item y se podra continuar con el ticket ¿Desea continuar?"
        : "¿Esta seguro de agregar este comentario y dar por aprobado el item?";
    const titleAviso = itemUsuario === "itemUsuario" ? "Validar Item" : "Aprobacion Item";
    if (actualizarItem) {
      FetchPut({
        consoleLog: false,
        sliceRequest: TicketsItemsProcesosResultadosSliceRequest.PutRequest,
        modelPut: actualizarItem,
        activeConfirmation: true,
        mensajePersonalizado: true,
        titleUser: titleAviso,
        messageUser: mensajeAviso,
        functionAdd: async () => {
          await dispatch(
            TicketsMensajesUsuariosSliceRequets.PostRequest(
              itemUsuario === "itemNormal" ? mensajeAutomatico : mensajeFinalAutomatico
            )
          );
          const actualizarListaItems = unwrapResult(
            await dispatch(TicketsItemsProcesosResultadosSliceRequest.GetAllItemsByTicketId(ticketSeleccionado.id))
          );
          if (actualizarListaItems) {
            await dispatch(EmailSliceRequest.SendEmailTicketProceso(actualizarItem));
            const response = unwrapResult(
              await dispatch(TicketsMensajesUsuariosSliceRequets.GetAllMensajesByTicketId(ticketSeleccionado.id))
            );
            await dispatch(TicketsTrazabilidadSliceRequest.PostRequest(trazaGenerada));
            refreshMensajes(response);
            openNotificationUI(`Se termino el item: ${itemAñadirValidacion.nombre}`, "success");
            refreshItems(actualizarListaItems);
            setOpenModal(false);
          }
          if (!colaboradorEncontrado) {
            cargarColaborador();
          }
        }
      });
    }
  };

  // const cancelarValidacion = () => {
  //   const itemNoValidado: ITicketsItemsProcesosResultados = {
  //     ...itemAñadirValidacion,
  //     estadoAprobado: false,
  //     comentarioAprobado: ""
  //   };
  //   const mensajeFinalAutomatico = mensajeAutomaticoUsuario("noValidado");
  //   FetchPut({
  //     consoleLog: false,
  //     sliceRequest: TicketsItemsProcesosResultadosSliceRequest.PutRequest,
  //     modelPut: itemNoValidado,
  //     activeConfirmation: true,
  //     mensajePersonalizado: true,
  //     titleUser: "Cancelar Validacion",
  //     messageUser: "¿Esta seguro de cancelar la validacion?",
  //     functionAdd: async () => {
  //       await dispatch(TicketsMensajesUsuariosSliceRequets.PostRequest(mensajeFinalAutomatico));
  //       const actualizarListaItems = unwrapResult(
  //         await dispatch(TicketsItemsProcesosResultadosSliceRequest.GetAllItemsByTicketId(ticketSeleccionado.id))
  //       );
  //       if (actualizarListaItems) {
  //         await dispatch(EmailSliceRequest.SendEmailTicketProceso(itemNoValidado));
  //         const response = unwrapResult(
  //           await dispatch(TicketsMensajesUsuariosSliceRequets.GetAllMensajesByTicketId(ticketSeleccionado.id))
  //         );
  //         await dispatch(TicketsTrazabilidadSliceRequest.PostRequest(trazaGenerada));
  //         refreshMensajes(response);
  //         openNotificationUI(`Se cancelo la validacion del item: ${itemAñadirValidacion.nombre}`, "success");
  //         refreshItems(actualizarListaItems);
  //         setOpenModal(false);
  //       }
  //       if (!colaboradorEncontrado) {
  //         cargarColaborador();
  //       }
  //     }
  //   });
  // };

  const cargarColaborador = async () => {
    const nuevoBloqueColaboradores: ITicketsColaboradoresBloque = {
      colaboradoresId: infoUser.operatorId,
      ticketsId: ticketSeleccionado.id
    };
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(TicketsColaboradoresBloqueSliceRequest.PostRequest(nuevoBloqueColaboradores))
      );
      if (response) {
        const responseRefreshColaboradores = unwrapResult(
          await dispatch(TicketsColaboradoresBloqueSliceRequest.GetAllColabsByTicket(ticketSeleccionado.id))
        );
        if (responseRefreshColaboradores) {
          setRefresListaColaboradores(responseRefreshColaboradores);
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const gemerarActualizacionAndMensajeAutomatico = (formData: any) => {
    try {
      const itemActualizado: ITicketsItemsProcesosResultados = {
        ...itemAñadirValidacion,
        comentarioAprobado:
          itemUsuario === "itemNormal" ? formData.comentarioAprobacion : itemAñadirValidacion.comentarioAprobado,
        operatorId: infoUser.operatorId,
        estadoAprobado: true,
        ticketsId: ticketSeleccionado.id,
        aprobadoCliente: null,
        aprobacionIntermedia: itemUsuario === "itemNormal" ? itemAñadirValidacion.aprobacionIntermedia : false,
        mensajeAprobacion: itemUsuario === "itemUsuario" ? formData.comentarioAprobacion : null
      };
      delete itemActualizado.operator;
      delete itemActualizado.rol;
      if (itemActualizado) {
        return itemActualizado;
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(`Se genero un error intenando generar el item validado: ${error}`, "error");
    }
  };

  const mensajeAutomaticoUsuario = (typeMessage: "validado" | "reValidado" | "noValidado", formData?: any) => {
    let mensaje: string;
    switch (typeMessage) {
      case "validado":
        mensaje = `El item ${itemAñadirValidacion.nombre.toUpperCase()}, se dio por aprobado \n comentario: ${
          formData.comentarioAprobacion
        }`;
        break;
      case "reValidado":
        mensaje = `El item ${itemAñadirValidacion.nombre.toUpperCase()}, se re hizo y se dio por aprobado por parte del usuario \n comentario: ${
          formData.comentarioAprobacion
        }`;
        break;
      case "noValidado":
        mensaje = `El item ${itemAñadirValidacion.nombre.toUpperCase()}, no se dio por aprobado por parte del usuario \n comentario: ${
          formData.comentarioAprobacion
        }`;
        break;
    }
    const mensajeAutomatico: ITicketsMensajesUsuario = {
      ticketsId: ticketSeleccionado.id,
      mensaje,
      operatorId: 1414
    };
    return mensajeAutomatico;
  };

  const mensajeAutomaticoFunction = (item: ITicketsItemsProcesosResultados, data?: any) => {
    let mensaje = "";
    if (item.aprobadoCliente === null) {
      mensaje = `El item ${item.nombre.toUpperCase()}, se dio por aprobado por parte del usuario \n comentario: ${
        data.comentarioAprobacion
      }`;
    } else if (item.aprobacionIntermedia === false) {
      mensaje = `El item ${item.nombre.toUpperCase()}, se re hizo y se dio por aprobado por parte del usuario \n comentario: ${
        data.comentarioAprobacion
      }`;
    }
    const mensajeAutomatico: ITicketsMensajesUsuario = {
      ticketsId: ticketSeleccionado.id,
      mensaje,
      operatorId: 1414
    };
    return mensajeAutomatico;
  };

  return (
    <main className="w-[45vw]">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full">
          <Controller
            name="comentarioAprobacion"
            control={control}
            defaultValue=""
            rules={{
              required: { value: true, message: "Debe ingresar un comentario" },
              minLength: { value: 10, message: "El comentario debe contener mas de 10 caracteres" }
            }}
            render={({ field }) => (
              <TextField
                autoFocus
                autoComplete="off"
                fullWidth
                {...field}
                label={`Ingrese con detalle la solucion del item: ${itemAñadirValidacion.nombre.toUpperCase()}`}
                error={!!errors.comentarioAprobacion}
                helperText={errors.comentarioAprobacion?.message}
                variant="outlined"
              />
            )}
          />
        </div>
        <div className="flex flex-row justify-center gap-x-3 mt-4">
          <Button className={buttonClases.greenButton} type="submit" disabled={!isValid}>
            Guardar
          </Button>
          {/* <Button className={buttonClases.blueButtonTickets} onClick={cancelarValidacion}>
            No Validar
          </Button> */}
          <Button
            className={buttonClases.redButton}
            type="button"
            onClick={() => {
              setOpenModal(false);
            }}>
            Cancelar
          </Button>
        </div>
      </form>
    </main>
  );
};
