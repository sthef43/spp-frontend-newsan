/* eslint-disable no-useless-escape */
import {
  AccountCircleRounded,
  CalendarTodayRounded,
  Check,
  CloudUploadRounded,
  Download,
  FolderOpenRounded,
  HighlightOffOutlined,
  InfoRounded,
  NewReleasesRounded,
  Telegram
} from "@mui/icons-material";
import { Button, FormControl, InputLabel, MenuItem, Select, Tooltip } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { MaterialButtons } from "app/shared/components/material-ui/MaterialButtons";
import FetchApi from "app/shared/helpers/FetchApi";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ITickets } from "../models/ITickets";
import { ITicketsMensajesUsuario } from "../models/ITicketsMensajesUsuario";
import { ActualizarItemsTicketModal } from "./ActualizarItemsTicketModal";
import { ITicketsEstados } from "../models/ITicketsEstado";
import { useConfirmationDialog } from "app/shared/hooks/useConfirmationDialog";
import { ITicketsColaboradoresBloque } from "../models/ITicketsColaboradoresBloque";
import { ItemTerminadoModal } from "./DetallesTicketModal/ItemTerminadoModal";
import { ITicketsItemsProcesosResultados } from "../models/ITicketsItemsProcesosResultados";
import { EmailSliceRequest } from "app/Middleware/reducers/EmailSlice";
import { VerImagenCargadaModal } from "./VerImagenCargadaModal";
import { ListaArchivosPreCargados } from "./DetallesTicketModal/ListaArchivosPreCargados";
import { ITicketsArchivos } from "../models/ITicketsArchivos";
import { IAppUser } from "app/models";
import { AprobacionItemsClienteModal } from "./DetallesTicketModal/AprobacionItemsClienteModal";
import { ItemTerminadoDialog } from "../components/ItemTerminadoModal";
import { useFileChange } from "app/shared/hooks/useFileChange";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { ITicketsTrazabilidad } from "../models/ITicketsTrazabilidad";
import { useFetchApiMultiResults } from "app/shared/hooks/UseFetchApiMultiResults";
import { ImagenMensajeAsincrona } from "../components/ImagenMensajeAsincronico";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { TicketsArchivosSliceRequest } from "../reducers/TicketsArchivosSlice";
import { TicketsColaboradoresBloqueSliceRequest } from "../reducers/TicketsColaboradoresBloqueSlice";
import { TicketsItemsProcesosResultadosSliceRequest } from "../reducers/TicketsItemsProcesosResultadosSlice";
import { TicketsMensajesUsuariosSliceRequets } from "../reducers/TicketsMensajesUsuariosSlice";
import { TicketsSliceRequest } from "../reducers/TicketsSlice";
import { TicketsTrazabilidadSliceRequest } from "../reducers/TicketsTrazabilidadSlice";

interface Props {
  ticketSeleccionado?: ITickets;
  setTicketSeleecionado: (newValue: ITickets) => void;
  openModal: boolean;
  setOpenModal: (newValue: boolean) => void;
  esUsuarioAgente?: boolean;
  esHistorial?: boolean;
  setFunctionRefresh?: (fn: () => Promise<void>) => void;
}

interface DescripcionLink {
  descripcion: string;
  link: boolean;
}

interface IFormInput {
  nuevoMensaje: string;
  estadoTicketId: number;
}

const defaultValues = {
  nuevoMensaje: "",
  estadoTicketId: 0
};

export const DetallesTikcetModal: React.FC<Props> = ({
  ticketSeleccionado,
  openModal,
  setOpenModal,
  setTicketSeleecionado,
  esUsuarioAgente,
  esHistorial,
  setFunctionRefresh
}) => {
  const { control, watch, setValue, handleSubmit, register } = useForm<IFormInput>({
    defaultValues: defaultValues
  });

  const watchValorEstadoTicket = watch("estadoTicketId");

  const estadosTickets = useAppSelector<ITicketsEstados[]>(
    (state) => state.ticketsEstados.dataAll as ITicketsEstados[]
  );
  const siguienteItem = useAppSelector((state) => state.ticketsItemsResultados.object);
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();
  const { getConfirmation } = useConfirmationDialog();
  const { selectFileChange } = useFileChange();
  const { FetchPut } = useFetchApiMultiResults();

  const buttonClases = MaterialButtons();
  const ref: any = useRef(null);
  const latestMessages = useRef(null);
  const scrollMensajesFinal = useRef(null);

  const [archivoChat, setArchivoChat] = useState(false);
  const [activeValidacionCliente, setActiveValidacionCliente] = useState<"itemNormal" | "itemUsuario" | "">("");

  const [openModalActualizarItem, setOpenModalActualizarItem] = useState(false);
  const [openModalImage, setOpenModaImage] = useState(false);
  const [openModalListadoArchivos, setOpenModalListadoArchivos] = useState(false);
  const [openModalAprobarItems, setOpenModalAprobarItems] = useState(false);
  const [openModalJustificacion, setOpenModalJustificacion] = useState(false);

  const [srcImagenSeleccionada, setSrcImagenSeleccionada] = useState(null);
  const [coneccionWebSocket, setConeccionWebSocket] = useState(null);
  const [urlImageUpload, setImageUpload] = useState<File>(null);

  const [trazabilidadTicket, setTrazabilidadTicket] = useState<ITicketsTrazabilidad>();
  const [itemSeleccionado, setItemSeleccionado] = useState<ITicketsItemsProcesosResultados>();
  const [itemActual, setItemActual] = useState<ITicketsItemsProcesosResultados>();
  const [descripcion, setDescripcion] = useState<DescripcionLink[]>([]);

  const mensajeChat = watch("nuevoMensaje");

  const [mensajesTicket, setMensajesTicket] = useState<ITicketsMensajesUsuario[]>([]);
  latestMessages.current = mensajesTicket;
  FetchApi<ITicketsMensajesUsuario[]>(
    TicketsMensajesUsuariosSliceRequets.GetAllMensajesByTicketId,
    ticketSeleccionado.id,
    false,
    openModal,
    setMensajesTicket,
    false
  );

  const [listaItems, setListaItems] = useState<ITicketsItemsProcesosResultados[]>([]);
  FetchApi<ITicketsItemsProcesosResultados[]>(
    TicketsItemsProcesosResultadosSliceRequest.GetAllItemsByTicketId,
    ticketSeleccionado.id,
    false,
    openModal,
    setListaItems
  );

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [listaColaboradores, setListaColaboradores] = useState<ITicketsColaboradoresBloque[]>([]);
  FetchApi<ITicketsColaboradoresBloque[]>(
    TicketsColaboradoresBloqueSliceRequest.GetAllColabsByTicket,
    ticketSeleccionado.id,
    false,
    openModal,
    setListaColaboradores
  );

  const [getListaArchivos, setGetListaArchivos] = useState<ITicketsArchivos[]>([]);
  FetchApi<ITicketsArchivos[]>(
    TicketsArchivosSliceRequest.GetFilesByTicketId,
    ticketSeleccionado.id,
    false,
    openModal,
    setGetListaArchivos
  );

  const guardarMensaje = async (event) => {
    const nuevoMensaje = generarNuevoMensaje();
    let response: ITicketsMensajesUsuario;
    try {
      if (coneccionWebSocket && nuevoMensaje) {
        event.preventDefault();
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        if (urlImageUpload === null) {
          response = unwrapResult(await dispatch(TicketsMensajesUsuariosSliceRequets.CreateNewMessage(nuevoMensaje)));
        } else {
          response = unwrapResult(
            await dispatch(
              TicketsMensajesUsuariosSliceRequets.CreateNewMessageWithImage({
                ticket: nuevoMensaje,
                imagenFile: urlImageUpload
              })
            )
          );
        }
        if (response) {
          setValue("nuevoMensaje", "");
          setImageUpload(null);
        }
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const actualizarTicket = async () => {
    const nuevaTraza = generarAccionTrazabilidad("Estado");
    const actualizacionEstadoTicket = cambiarEstadoTicket();
    try {
      if (watchValorEstadoTicket != 4 && watchValorEstadoTicket != 5) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        await dispatch(TicketsSliceRequest.PutRequest(actualizacionEstadoTicket));
        const ticketActualizado = unwrapResult(
          await dispatch(TicketsSliceRequest.getByIdRequest(actualizacionEstadoTicket.id))
        );
        if (ticketActualizado) {
          await dispatch(EmailSliceRequest.SendEmailStateTicket(actualizacionEstadoTicket));
          await dispatch(TicketsTrazabilidadSliceRequest.PostRequest(nuevaTraza));
          setValue("estadoTicketId", 0);
          setTicketSeleecionado(ticketActualizado);
        }
      } else {
        if (
          await getConfirmation(
            "Cambiar a Solucionado",
            "El ticket pasara al estado de solucionado, y no se podra modificar, ¿desea continuar?",
            null,
            "Confirmar",
            "Cancelar"
          )
        ) {
          dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
          await dispatch(TicketsSliceRequest.PutRequest(actualizacionEstadoTicket));
          const ticketActualizado = unwrapResult(
            await dispatch(TicketsSliceRequest.getByIdRequest(actualizacionEstadoTicket.id))
          );
          if (ticketActualizado) {
            await dispatch(EmailSliceRequest.SendEmailStateTicket(actualizacionEstadoTicket));
            await dispatch(TicketsTrazabilidadSliceRequest.PostRequest(nuevaTraza));
            setValue("estadoTicketId", 0);
            setTicketSeleecionado(ticketActualizado);
          }
        }
      }
      // ESTO ES PARA CUANDO SE MARCAEL TICKET COMO CERRADO Y SE COMIENZA LA APROBACION DE LOS ITEMS AUTOMATICAMENTE
      // if (watchValorEstadoTicket == 4) {
      //   if (
      //     await getConfirmation(
      //       "Comenzar Aprobacion",
      //       "Se comenzara la aprobacion de los items",
      //       null,
      //       "Confirmar",
      //       "Cancelar"
      //     )
      //   ) {
      //     setValue("estadoTicketId", 0);
      //     setOpenModalAprobarItems(true);
      //   }
      // }
    } catch (erorr) {
      console.log(erorr);
      openNotificationUI(erorr, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const handleGetImageTicketPreview = async (url: string): Promise<string> => {
    try {
      LoadingUISlice.actions.LoadingUIOpen();
      const response = unwrapResult(
        await dispatch(
          TicketsMensajesUsuariosSliceRequets.GetImageMessageTicket({
            ticketId: ticketSeleccionado.id,
            nombreArchivo: url
          })
        )
      );
      if (response) {
        console.log(response);
        return response;
      }
    } catch (error) {
      LoadingUISlice.actions.LoadingUIClose();
      console.log(error);
    } finally {
      LoadingUISlice.actions.LoadingUIClose();
    }
  };

  const handleDescarArchivo = async (url: string) => {
    try {
      LoadingUISlice.actions.LoadingUIOpen();
      const response = unwrapResult(
        await dispatch(
          TicketsMensajesUsuariosSliceRequets.DownloadArchiveMessageTicket({
            ticketId: ticketSeleccionado.id,
            nombreArchivo: url
          })
        )
      );
      LoadingUISlice.actions.LoadingUIClose();
      if (response) {
        console.log(response);
      }
    } catch (error) {
      LoadingUISlice.actions.LoadingUIClose();
      console.log(error);
    } finally {
      LoadingUISlice.actions.LoadingUIClose();
    }
  };

  //CUANDO SE AGREGUE UNA NUEVA FUNCION QUE SE EJECUTE AL ABRIR EL MODAL, AGREGARLA A ESTA FUNCION
  const refreshTicket = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const responseMensajes = unwrapResult(
        await dispatch(TicketsMensajesUsuariosSliceRequets.GetAllMensajesByTicketId(ticketSeleccionado.id))
      );
      const responseItems = unwrapResult(
        await dispatch(TicketsItemsProcesosResultadosSliceRequest.GetAllItemsByTicketId(ticketSeleccionado.id))
      );
      const responseBloquesColaboradores = unwrapResult(
        await dispatch(TicketsColaboradoresBloqueSliceRequest.GetAllColabsByTicket(ticketSeleccionado.id))
      );
      const responseArchivos = unwrapResult(
        await dispatch(TicketsArchivosSliceRequest.GetFilesByTicketId(ticketSeleccionado.id))
      );
      if (responseArchivos && responseMensajes && responseItems && responseBloquesColaboradores) {
        setMensajesTicket(responseMensajes);
        setListaItems(responseItems);
        setListaColaboradores(responseBloquesColaboradores);
        setGetListaArchivos(responseArchivos);
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const cambiarEstadoTicket = () => {
    const ticketFormateado = {
      ...ticketSeleccionado,
      ticketsEstadoId: watchValorEstadoTicket,
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

  const generarAccionTrazabilidad = (
    opcionAccion:
      | "Estado"
      | "Aprobacion"
      | "Item Terminado"
      | "Solucion Rechazada"
      | "Rechazar Solucion en Grupo"
      | "Aprobacion Cliente",
    itemActual?: ITicketsItemsProcesosResultados,
    itemSeleccionado?: ITicketsItemsProcesosResultados
  ) => {
    let mensaje = "";
    const estadoSeleccionado = estadosTickets.find((elementos) => elementos.id === watchValorEstadoTicket);
    switch (opcionAccion) {
      case "Estado":
        mensaje = `Se cambio el estado del ticket a ${estadoSeleccionado.nombre}`;
        break;
      case "Aprobacion":
        mensaje = `Se aprobo el item ${itemActual.nombre}`;
        break;
      case "Item Terminado":
        mensaje = `Se ${
          itemActual.aprobadoCliente === null
            ? `termino el item ${itemActual.nombre}`
            : `rehizo el item ${itemActual.nombre}`
        }`;
        break;
      case "Solucion Rechazada":
        mensaje = `Se rechazo la solucion del item ${itemSeleccionado.nombre}`;
        break;
      case "Rechazar Solucion en Grupo":
        mensaje = `Se rechazo la solucion de los items: `;
        break;
      case "Aprobacion Cliente":
        mensaje = `El cliente aprobo el item ${itemActual.nombre}`;
        break;
      default:
        mensaje = "";
        break;
    }
    const accionTrazabilidad: ITicketsTrazabilidad = {
      ticketsId: ticketSeleccionado.id,
      operatorId: infoUser.operatorId,
      accion: opcionAccion,
      mensajeAccion: mensaje
    };
    setTrazabilidadTicket(accionTrazabilidad);
    return accionTrazabilidad;
  };

  const generarNuevoMensaje = () => {
    const nuevoMensaje: ITicketsMensajesUsuario = {
      operatorId: infoUser.operatorId,
      operator: infoUser.operator,
      ticketsId: ticketSeleccionado.id,
      mensaje: mensajeChat,
      archivo: urlImageUpload === null ? null : urlImageUpload.name
    };
    return nuevoMensaje;
  };

  const continuarTikcet = (tipoTicket: "itemNormal" | "itemUsuario") => {
    let itemTicketValidar;
    if (tipoTicket === "itemNormal") {
      itemTicketValidar = listaItems.find((elementos) => {
        return elementos.estadoAprobado === false;
      });
    } else {
      const itemsEchos = listaItems.filter((elementos) => elementos.estadoAprobado);
      const ultimoItemAprobado = itemsEchos.at(-1);
      itemTicketValidar = ultimoItemAprobado;
    }
    if (itemTicketValidar.rolId == infoUser.permisos.rolId && tipoTicket == "itemNormal") {
      setItemActual(itemTicketValidar);
      setActiveValidacionCliente(tipoTicket);
      setTrazabilidadTicket(generarAccionTrazabilidad("Item Terminado", itemTicketValidar));
      setOpenModalActualizarItem(!openModalActualizarItem);
    } else if (tipoTicket == "itemUsuario") {
      setItemActual(itemTicketValidar);
      setActiveValidacionCliente(tipoTicket);
      setTrazabilidadTicket(generarAccionTrazabilidad("Item Terminado", itemTicketValidar));
      setOpenModalActualizarItem(!openModalActualizarItem);
    } else {
      openNotificationUI(
        `Debes tener los permisos del rol ${itemTicketValidar.rol.name} para realizar el item`,
        "warning"
      );
    }
  };

  const validarRolSiguienteItem = () => {
    const itemTicketValidar = listaItems.find((elementos) => {
      return elementos.estadoAprobado === false;
    });
    if (itemTicketValidar.rolId != infoUser.permisos.rolId) {
      return true;
    } else {
      return false;
    }
  };

  const verificarRolCambiarEstadoTicket = () => {
    let verificador = false;
    if (siguienteItem != null) {
      verificador = siguienteItem.rolId != infoUser.permisos.rolId;
    }
    return verificador;
  };

  const seleccionarImagen = () => {
    ref.current.click();
  };

  const estadoTicket = (ticketSeleccionado: ITickets) => {
    switch (ticketSeleccionado.ticketsEstado.nombre) {
      case "Abierto":
        return <p className="px-2 py-1 rounded-2xl text-xs bg-[#1dabdf] text-[#fafafa]">Estado: Abierto</p>;
      case "En Progreso":
        return <p className="px-2 py-1 rounded-2xl text-xs bg-[#f09101] text-[#fafafa]">Estado: En progreso</p>;
      case "Cerrado":
        return <p className="px-2 py-1 rounded-2xl text-xs bg-[#d51616] text-[#fafafa]">Estado: Cerrado</p>;
      case "Solucionado":
        return <p className="px-2 py-1 rounded-2xl text-xs bg-[#4bd422d3] text-[#fafafa]">Estado: Solucionado</p>;
      default:
        return <p>Sin informacion</p>;
    }
  };

  const ultimaFechaActualizacion = (fechaActualizacion: ITickets) => {
    const fecha = new Date(fechaActualizacion.lastModifiedDate);
    if (fecha) {
      return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
    } else {
      return `Sin fecha`;
    }
  };

  const añadirCero = (hora) => {
    if (hora < 10) {
      hora = "0" + hora;
      return hora;
    } else {
      return hora;
    }
  };

  const separarDescripcion = () => {
    const listaObjetosLinks: DescripcionLink[] = [];
    let objetoLink: DescripcionLink;
    const descripcionSepara = ticketSeleccionado.descripcion.split("\n");
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-]*)*\/?(\?.*)?(#.*)?$/;
    descripcionSepara.map((elementos) => {
      const linkValido = urlRegex.test(elementos);
      objetoLink = { descripcion: elementos, link: linkValido };
      listaObjetosLinks.push(objetoLink);
    });
    if (listaObjetosLinks) {
      setDescripcion(listaObjetosLinks);
    }
  };

  const personaUltimaActualizacion = (listaItems: ITicketsItemsProcesosResultados[]) => {
    const itemsEchos = listaItems.filter((elementos) => elementos.estadoAprobado);
    const ultimoItemAprobado = itemsEchos.at(-1);
    if (ultimoItemAprobado) {
      return `${ultimoItemAprobado.operator.name} ${ultimoItemAprobado.operator.surname}`;
    } else {
      return "Ticket sin iniciar";
    }
  };

  const fechaMensaje = (infoMensaje: ITicketsMensajesUsuario) => {
    const fecha = new Date(infoMensaje.createdDate);
    if (fecha) {
      return `${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()} ${añadirCero(
        fecha.getHours()
      )}:${añadirCero(fecha.getMinutes())}`;
    } else {
      return `Sin fecha`;
    }
  };

  const verificarItemActual = (): boolean => {
    if (listaItems && listaItems.length > 0 && ticketSeleccionado) {
      const itemActual = listaItems.filter((item) => item.estadoAprobado == true && item.aprobacionIntermedia == true);
      const ultimoItem = itemActual.at(-1);
      if (ultimoItem) {
        return true;
      }
    }
    return false;
  };

  const iconItem = (itemAprobado: boolean, index: number) => {
    let icon;
    const item = listaItems[index];
    const verificacionNecesaria = itemAprobado && item.aprobacionIntermedia;
    if (verificacionNecesaria) {
      icon = <InfoRounded />;
    } else if (itemAprobado) {
      icon = <Check />;
    } else {
      icon = index + 1;
    }
    return icon;
  };

  const colorIconItem = (itemAprobado: boolean, index: number) => {
    let colorIcon;
    const item = listaItems[index];
    const verificacionNecesaria = itemAprobado && item.aprobacionIntermedia;
    if (verificacionNecesaria) {
      colorIcon = "bg-blue-500 border-blue-500";
    } else if (itemAprobado) {
      colorIcon = "bg-green-500 border-green-500";
    } else {
      colorIcon = "bg-gray-500 border-gray-500";
    }
    return colorIcon;
  };

  const colorLinea = (itemAprobado: boolean, index: number) => {
    let colorIcon;
    const item = listaItems[index];
    const verificacionNecesaria = itemAprobado && item.aprobacionIntermedia;
    if (verificacionNecesaria) {
      colorIcon = "border-blue-500 text-blue-500";
    } else if (itemAprobado) {
      colorIcon = "border-green-500 text-green-500";
    } else {
      colorIcon = "border-gray-500 text-gray-500";
    }
    return colorIcon;
  };

  const verificarBloqueoCambioEstado = (): boolean => {
    const estaCerrado = ticketSeleccionado.ticketsEstadoId === 4;
    const sinEstadoSeleccionado = watchValorEstadoTicket === 0;

    const estaEnProgreso = ticketSeleccionado.ticketsEstadoId === 3;
    const noEsElCreador = infoUser.operatorId !== ticketSeleccionado.operatorId;
    const tieneItemsPendientes = listaItems.some(
      (item) => item.estadoAprobado === false || item.aprobacionIntermedia === true
    );

    return estaCerrado || sinEstadoSeleccionado || (estaEnProgreso && (noEsElCreador || tieneItemsPendientes));
  };

  const scrollFinalMensjaes = () => {
    if (scrollMensajesFinal.current) {
      scrollMensajesFinal.current.scrollTop = scrollMensajesFinal.current.scrollHeight;
    }
  };

  const handleModalExaminarjustificacion = (elemento: ITicketsItemsProcesosResultados) => {
    setItemSeleccionado(elemento);
    setTrazabilidadTicket(generarAccionTrazabilidad("Solucion Rechazada", null, elemento));
    setOpenModalJustificacion(true);
  };

  const handleOpenModalImagen = (srcImagen: string) => {
    setSrcImagenSeleccionada(srcImagen);
    setArchivoChat(false);
    setOpenModaImage(true);
  };

  const handleOpenModalImageChat = () => {
    setArchivoChat(true);
    setOpenModaImage(true);
  };

  useEffect(() => {
    if (openModal && mensajesTicket) {
      separarDescripcion();
      if (mensajesTicket.length > 5) {
        scrollFinalMensjaes();
      }
      const hubUrl = `${import.meta.env.VITE_SIGNALR_URL}`;
      const newConnection = new HubConnectionBuilder().withUrl(hubUrl).withAutomaticReconnect().build();
      setConeccionWebSocket(newConnection);
      newConnection.on("MensajeTickets", (nuevoMensajeRecibido) => {
        setMensajesTicket((mensajesAnteriores) => [...mensajesAnteriores, nuevoMensajeRecibido]);
      });
      newConnection
        .start()
        .then(() => console.log("Conexión con WebSocket establecida."))
        .catch((error) => console.log("Error al conectar con WebSocket:", error));
      return () => {
        newConnection.stop();
      };
    }
  }, [openModal, mensajesTicket.length]);

  useEffect(() => {
    setFunctionRefresh(refreshTicket);
  }, []);

  return (
    <main
      className={`w-full h-[96vh] p-4 z-10 absolute top-0 left-0 right-0 m-auto bg-secondaryNew ${
        openModal ? "block" : "hidden"
      }`}>
      <section className="w-full h-full rounded-b-md border-t-4 border-t-red-500 p-4 shadow-xl border-x bg-secondaryNew border-x-gray-50 border-b border-b-gray-50 flex flex-col">
        <header className="flex w-full justify-between items-baseline mb-2">
          <h1 className="text-xl font-semibold">Detalle del Ticket</h1>
          <button onClick={() => setOpenModal(!openModal)}>
            <HighlightOffOutlined />
          </button>
        </header>
        <section
          className={`w-full flex-shrink-0 flex flex-row items-center mb-3 justify-start div-item-tickets ${
            esUsuarioAgente ? "overflow-x-auto h-[75px]" : "overflow-hidden"
          }`}>
          {listaItems &&
            listaItems.map((elementos, index) => {
              const itemTerminado = elementos.estadoAprobado;
              return (
                <div key={elementos.id} className={`w-full flex flex-row text-center basis-0 mt-2`}>
                  <figure className="w-[256px] relative z-20">
                    <figure
                      className={`w-[101%] h-[2px] absolute top-[20%] z-10 border-2 rounded-lg ${colorLinea(
                        itemTerminado,
                        index
                      )}`}></figure>
                    <span
                      onClick={() => {
                        itemTerminado ? handleModalExaminarjustificacion(elementos) : null;
                      }}
                      className={`rounded-full border-2 text-white font-semibold relative z-10 ${
                        itemTerminado
                          ? `${colorIconItem(
                              itemTerminado,
                              index
                            )} cursor-pointer hover:shadow-shadowBox transition-all duration-500 px-[.4rem] py-2`
                          : `border-slate-500 py-2 px-3 ${colorIconItem(itemTerminado, index)}`
                      }`}>
                      {iconItem(itemTerminado, index)}
                    </span>
                    <p className={`${colorLinea(itemTerminado, index)} text-xs font-semibold mt-4 uppercase`}>
                      {elementos.nombre}
                    </p>
                  </figure>
                </div>
              );
            })}
        </section>
        <section className="flex flex-row gap-x-4 items-stretch flex-grow overflow-hidden min-h-0">
          <div className="w-[75%] h-full border border-gray-300 rounded-md flex flex-col">
            <div ref={scrollMensajesFinal} className="flex-grow min-h-0 overflow-y-auto p-3 flex flex-col gap-y-4">
              {mensajesTicket &&
                mensajesTicket.length > 0 &&
                mensajesTicket.map((elementos, index) => {
                  const mensajeAutomatico = elementos.mensaje.split("\n");
                  const esUsuario = elementos.operatorId === infoUser.operatorId;
                  const usuarioSitema = elementos.operatorId === 1414;
                  return (
                    <div key={index} className={`w-full flex flex-col ${esUsuario ? "items-end" : "items-start"}`}>
                      <div className="w-[80%] flex flex-col gap-y-4">
                        <div
                          className={`p-2 rounded-lg max-w-full flex flex-col gap-2 shadow-md
                            ${
                              esUsuario
                                ? "scale-x-[-1] self-end  border border-sky-200 bg-sky-400 text-white"
                                : usuarioSitema
                                ? "bg-slate-300 text-black self-start"
                                : "self-start bg-mensajeTicketsReceptor border border-gray-200"
                            }`}>
                          <p className={`text-sm capitalize ${esUsuario ? "scale-x-[-1] text-left" : "text-left"}`}>
                            {elementos.operator.name} {elementos.operator.surname}
                          </p>
                          {elementos.archivo !== null && (
                            <div className="w-[70%] max-w-0 min-w-fit">
                              {elementos.tipoArchivo && elementos.tipoArchivo.includes("image") ? (
                                <figure
                                  onClick={() => {
                                    handleOpenModalImagen(elementos.archivo);
                                  }}
                                  className={`${esUsuario ? "scale-x-[-1]" : ""} w-auto max-w-xs cursor-pointer`}>
                                  <ImagenMensajeAsincrona
                                    nombreArchivo={elementos.archivo}
                                    fetchFunction={handleGetImageTicketPreview}
                                  />
                                </figure>
                              ) : elementos.tipoArchivo && !elementos.tipoArchivo.includes("image") ? (
                                <figure className={`${esUsuario ? "scale-x-[-1]" : ""} max-w-xs cursor-pointer w-full`}>
                                  <Tooltip title="Descargar Archivo">
                                    <Button
                                      className={buttonClases.blueButton}
                                      onClick={() => handleDescarArchivo(elementos.archivo)}>
                                      <Download />
                                      Descargar Archivo
                                    </Button>
                                  </Tooltip>
                                </figure>
                              ) : (
                                <p className={`text-sm ${esUsuario ? "scale-x-[-1] text-right" : "text-left"}`}>
                                  {elementos.mensaje}
                                </p>
                              )}
                            </div>
                          )}
                          {mensajeAutomatico.map((mensaje, index) => {
                            return (
                              <p
                                key={index}
                                className={`text-sm ${esUsuario ? "scale-x-[-1] text-right" : "text-left"} ${
                                  index == 1 ? "text-blue-500" : ""
                                }`}>
                                {mensaje}
                              </p>
                            );
                          })}
                          <p className={`text-[10px] text-gray-600 ${esUsuario ? "scale-x-[-1]" : ""}  text-right`}>
                            {fechaMensaje(elementos)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <form
              onSubmit={handleSubmit(guardarMensaje)}
              className="h-[90px] p-2 flex items-center gap-x-2 bg-backgroundColorMessageTicket">
              <div className="flex flex-row items-center rounded-3xl shadow-md p-2.5 w-full gap-x-2 bg-slate-200">
                <input
                  {...register("nuevoMensaje")}
                  type="text"
                  className="outline-none bg-slate-200 w-full p-1"
                  autoComplete="off"
                  placeholder="Ingrese una nueva actualización..."
                />
                <figure className="flex flex-row items-center gap-2">
                  <Tooltip title="Enviar mensaje">
                    <button
                      onClick={() => {
                        guardarMensaje(event);
                      }}
                      type="submit"
                      disabled={mensajeChat.length === 0 && urlImageUpload === null}
                      className={`${
                        mensajeChat.length === 0 && urlImageUpload === null
                          ? "bg-gray-300"
                          : "bg-blue-500 hover:bg-blue-700"
                      } rounded-full transition-all duration-300 p-1`}>
                      <Telegram style={{ fill: "white", fontSize: "1.5rem" }} />
                    </button>
                  </Tooltip>
                  <button
                    type="button"
                    onClick={seleccionarImagen}
                    className={`bg-blue-500 rounded-full hover:bg-blue-700 transition-all duration-300 p-1`}>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, .pdf, .xlsx, .xdoc, .doc, .csv"
                      name="añadirArchivoMensaje"
                      onChange={(e) => {
                        selectFileChange(e, setImageUpload, setSrcImagenSeleccionada);
                      }}
                      ref={ref}
                      multiple={false}
                      className="hidden"
                    />
                    <CloudUploadRounded style={{ fill: "white", fontSize: "1.5rem" }} />
                  </button>
                  {urlImageUpload && (
                    <Tooltip title={urlImageUpload.name}>
                      <div
                        onClick={() => {
                          handleOpenModalImageChat();
                        }}
                        className="bg-blue-500 hover:bg-blue-700 rounded-full transition-all duration-300 p-1">
                        <NewReleasesRounded style={{ fill: "white", fontSize: "1.5rem" }} />
                      </div>
                    </Tooltip>
                  )}
                </figure>
              </div>
              {/* En caso de tener que usar los anteriores estilos descomentar esto
                                <div className="w-full">
                                <TextFieldComponent
                                    control={control}
                                    index={0}
                                    nameInput="nuevoMensaje"
                                    valueDefault=""
                                    labelInput="Ingrese una nueva actualización..."
                                />
                            </div>
                            <button type="submit" onClick={(event) => { guardarMensaje(event) }} className="bg-blue-500 p-2 rounded-lg hover:bg-blue-700 transition-colors">
                                <SendRounded fontSize="small" sx={{ fill: "white" }} />
                            </button>
                            <button type="button" onClick={() => { refreshListaMensajes() }} className="p-2 transition-colors bg-blue-500 rounded-lg hover:bg-blue-700">
                                <RefreshOutlined style={{ fill: "white" }} />
                            </button> */}
              {/* <Tooltip title={`${urlImageUpload ? urlImageUpload.name : ''}`}>
                                <button onClick={seleccionarImagen} type="button" className="p-2 transition-colors bg-blue-500 rounded-lg hover:bg-blue-700">
                                    <input type="file"
                                        accept="image/png, image/jpeg, .pdf, .xlsx, .xdoc, .doc, .csv"
                                        name="añadirArchivoMensaje"
                                        onChange={onFileChange}
                                        ref={ref}
                                        multiple={false}
                                        className="hidden"
                                    />
                                    <AttachFileOutlined style={{ fill: "white" }} />
                                </button>
                            </Tooltip> */}
            </form>
          </div>
          {ticketSeleccionado && (
            <div className="w-[25%] h-full flex flex-col">
              <div className="flex-1 border border-gray-400 rounded-md p-3 bg-fondoInformacionTicket overflow-y-auto shadow-lg">
                <div>
                  <h2 className="text-base font-semibold">Ticket [{ticketSeleccionado.sdTicket}]:</h2>
                  <p className="mb-1 text-base font-semibold">{ticketSeleccionado.titulo}</p>
                  {descripcion && descripcion.length > 0 && (
                    <>
                      {descripcion.map((elementos, index) => (
                        <React.Fragment key={index}>
                          {elementos.link ? (
                            <div>
                              <a
                                className="text-xs text-blue-300 hover:underline hover:text-blue-500 transition-colors"
                                href={elementos.descripcion}
                                target="_blank"
                                rel="noreferrer">
                                {elementos.descripcion}
                              </a>
                              <br />
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500">{elementos.descripcion}</p>
                          )}
                        </React.Fragment>
                      ))}
                    </>
                  )}
                  <div className="flex flex-row justify-between w-full items-end">
                    <p className="mt-2 font-semibold">Detalles del Ticket</p>
                    <div>{estadoTicket(ticketSeleccionado)}</div>
                  </div>
                  <div className="flex flex-row gap-x-1 items-center mt-2">
                    <span className="p-1.5 bg-white rounded-full border-4 border-red-500"></span>
                    <p className="text-sm font-semibold text-textColor">PRIORIDAD: ALTA</p>
                  </div>
                  <div className="flex flex-col gap-y-2 mt-3">
                    {ticketSeleccionado.responsableOperator && listaItems && listaItems.length > 0 && (
                      <figure className="flex flex-row justify-start items-center gap-x-1">
                        <AccountCircleRounded color="info" fontSize="medium" />
                        <p className="text-xs text-textColor font-semibold">
                          Último cambio Por: {personaUltimaActualizacion(listaItems)}
                        </p>
                      </figure>
                    )}
                    <figure className="flex flex-row justify-start items-center gap-x-1">
                      <FolderOpenRounded color="info" fontSize="medium" />
                      <p className="text-xs text-textColor font-semibold">
                        Categoría: {ticketSeleccionado.ticketsCategoria.nombre}
                      </p>
                    </figure>
                    <figure className="flex flex-row justify-start items-center gap-x-1">
                      <CalendarTodayRounded color="info" fontSize="medium" />
                      <p className="text-xs text-textColor font-semibold">
                        Última Actividad: {ultimaFechaActualizacion(ticketSeleccionado)}
                      </p>
                    </figure>
                    <div className="flex flex-col w-full gap-y-2">
                      {siguienteItem && (
                        <div className="flex flex-row items-center gap-x-2">
                          <p className="text-xs text-gray-800 font-semibold">Pendiente por: </p>
                          <p className="bg-[#c0eeff] text-[#0080af] px-2 py-1 rounded-xl text-xs">
                            {siguienteItem.rol.name.trim()}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-row items-center mt-2 gap-x-2">
                      <>
                        {getListaArchivos && getListaArchivos.length > 0 && (
                          <div>
                            <button
                              className={`${buttonClases.blueButton} p-2 rounded-md`}
                              onClick={() => {
                                setOpenModalListadoArchivos(true);
                              }}>
                              Ver Archivos
                            </button>
                          </div>
                        )}
                        {!esUsuarioAgente && verificarItemActual() && (
                          <button
                            onClick={() => continuarTikcet("itemUsuario")}
                            className={`${buttonClases.purpleButtonTickets} p-2 rounded-md`}>
                            Aprobar y Continuar
                          </button>
                        )}
                      </>
                    </div>
                  </div>
                </div>
              </div>
              {listaItems && !esHistorial && (
                <div className="mt-4">
                  <div className="flex flex-col justify-center">
                    {estadosTickets && ticketSeleccionado.ticketsEstadoId !== 5 && (
                      <div className="mb-2">
                        <Controller
                          name="estadoTicketId"
                          control={control}
                          defaultValue={0}
                          render={({ field }) => (
                            <FormControl fullWidth>
                              <InputLabel id="Seleccion de estado">Estado del ticket</InputLabel>
                              <Select
                                disabled={ticketSeleccionado.ticketsEstadoId === 4}
                                {...field}
                                labelId="Seleccion de estado"
                                id="estado"
                                label="Estado del ticket">
                                {estadosTickets.map((elementos) => {
                                  const buscarTodosAprobados = listaItems.some(
                                    (item) => item.estadoAprobado === false || item.aprobacionIntermedia === true
                                  );
                                  const estadoActualEsAbierto = ticketSeleccionado.ticketsEstado.nombre === "Abierto";
                                  const esOpcionSolucionado = elementos.nombre === "Solucionado";
                                  const bloquearSolucionado = estadoActualEsAbierto && esOpcionSolucionado;
                                  return (
                                    <MenuItem
                                      className={`${
                                        elementos.nombre.toLowerCase().includes("todos") ||
                                        elementos.nombre.toLowerCase().includes("abierto") ||
                                        elementos.nombre.toLowerCase().includes("cerrado")
                                          ? "hidden"
                                          : ""
                                      }`}
                                      disabled={
                                        elementos.nombre === ticketSeleccionado.ticketsEstado.nombre ||
                                        (elementos.nombre === "Solucionado" && buscarTodosAprobados) ||
                                        verificarRolCambiarEstadoTicket() ||
                                        bloquearSolucionado
                                      }
                                      key={elementos.id}
                                      value={elementos.id}>
                                      {elementos.nombre}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          )}
                        />
                      </div>
                    )}
                    {ticketSeleccionado.ticketsEstadoId !== 5 ? (
                      <div className="flex flex-row w-full justify-between mt-1 gap-x-2">
                        <div>
                          <Button
                            disabled={verificarBloqueoCambioEstado()}
                            onClick={() => actualizarTicket()}
                            className={buttonClases.blueButtonTickets}>
                            Cambiar Estado
                          </Button>
                        </div>
                        <div>
                          <Button
                            disabled={
                              ticketSeleccionado.ticketsEstadoId === 2 ||
                              listaItems.every(
                                (elementos) =>
                                  elementos.estadoAprobado === true ||
                                  validarRolSiguienteItem() ||
                                  verificarItemActual()
                              )
                            }
                            onClick={() => continuarTikcet("itemNormal")}
                            className={buttonClases.greenButtonTickets}>
                            Siguiente Paso
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full flex justify-center">
                        <Button
                          disabled={infoUser.operatorId !== ticketSeleccionado.operatorId}
                          variant="contained"
                          sx={{ width: "100%" }}
                          onClick={() => setOpenModalAprobarItems(true)}
                          className={buttonClases.blueButtonTickets}>
                          Comenzar aprobacion
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </section>
      <ModalCompoment
        setOpenPopup={setOpenModalActualizarItem}
        title="Agregar comentario de aprobacion"
        openPopup={openModalActualizarItem}
        titleModalStyle="New"
        showModalCenterPage
        onCloseDynamic>
        <ActualizarItemsTicketModal
          itemUsuario={activeValidacionCliente}
          trazaGenerada={trazabilidadTicket}
          setRefresListaColaboradores={setListaColaboradores}
          refreshMensajes={setMensajesTicket}
          ticketSeleccionado={ticketSeleccionado}
          refreshItems={setListaItems}
          itemAñadirValidacion={itemActual}
          setOpenModal={setOpenModalActualizarItem}
          openModal={openModalActualizarItem}
        />
      </ModalCompoment>
      <ModalCompoment setOpenPopup={setOpenModaImage} openPopup={openModalImage} title="Imagen Cargada">
        <VerImagenCargadaModal
          archivoChat={archivoChat}
          vistaAgenteDetalles
          setOpenModal={setOpenModaImage}
          openModal={openModalImage}
          urlImagen={srcImagenSeleccionada}
          ticketId={ticketSeleccionado.id}
        />
      </ModalCompoment>
      {/* <ModalCompoment setOpenPopup={setOpenModalJustificacion} openPopup={openModalJustificacion} title="Item Terminado">
                <ItemTerminadoModal itemTerminado={itemSeleccionado} setOpenModal={setOpenModalJustificacion} openModal={openModalJustificacion} />
            </ModalCompoment> */}
      <ItemTerminadoDialog
        openModal={openModalJustificacion}
        setOpenModal={setOpenModalJustificacion}
        title="Item Terminado">
        <ItemTerminadoModal
          opcionGeneracion={generarAccionTrazabilidad}
          trazaGenerada={trazabilidadTicket}
          setItemProcesos={setListaItems}
          itemTerminado={itemSeleccionado}
          setOpenModal={setOpenModalJustificacion}
          openModal={openModalJustificacion}
          listaItems={listaItems}
        />
      </ItemTerminadoDialog>
      <ModalCompoment
        setOpenPopup={setOpenModalListadoArchivos}
        openPopup={openModalListadoArchivos}
        title="Archivos adjuntados">
        <ListaArchivosPreCargados
          ticketId={ticketSeleccionado.id}
          vistaAgenteDetalles
          setopenModal={setOpenModalListadoArchivos}
          openModal={openModalListadoArchivos}
          srcImagen={getListaArchivos}
        />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalAprobarItems}
        openPopup={openModalAprobarItems}
        title="Aprobar Soluciones">
        <AprobacionItemsClienteModal
          opcionGeneracion={generarAccionTrazabilidad}
          setTicketSeleecionado={setTicketSeleecionado}
          setOpenModalDetallesTicket={setOpenModal}
          ticketSeleccionado={ticketSeleccionado}
          setListaItemsSolucionados={setListaItems}
          setOpenModal={setOpenModalAprobarItems}
          openModal={openModalAprobarItems}
        />
      </ModalCompoment>
    </main>
  );
};
