import {
  AddCircleOutlineOutlined,
  ArrowCircleLeftOutlined,
  HistoryOutlined,
  MarkChatReadOutlined,
  MarkChatUnreadOutlined,
  NotificationAddOutlined,
  PersonOutline,
  RefreshRounded,
  TravelExploreOutlined
} from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "app/core/store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { DestinatariosNotificaciones } from "../pages/serviceDeskAgente/DestinatariosNotificaciones";
import { HistorialAgente } from "../pages/serviceDeskAgente/HistorialAgente";
import { TicketsCerrados } from "../pages/serviceDeskAgente/TicketsCerrados";
import { TikcetsPendientes } from "../pages/serviceDeskAgente/TicketsPendientes";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import { appUserSlice } from "app/Middleware/reducers/AppUserSlice";
import { ITickets } from "../models/ITickets";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { TicketEstadosSliceRequets, ticketsEstadoSlice } from "../reducers/TicketsEstado.service";
import { ITicketsColaboradoresBloque } from "../models/ITicketsColaboradoresBloque";
import { TicketsColaboradoresBloqueSliceRequest } from "../reducers/TicketsColaboradoresBloqueSlice";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { AgregarColaboradoModal } from "../modals/DetallesTicketModal/AgregarColaboradorModal";
import { IAppUser } from "app/models";
import { TicketsSliceRequest } from "../reducers/TicketsSlice";
import { BusquedaGlobal } from "../pages/paginasCompartidas/BusquedaGlobal";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const LayoutServiceDeskAgente = () => {
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [funcionRefresh, setFuncionRefresh] = useState<(() => Promise<void>) | null>(null);

  const [subMenuSeleccionado, setSubMenuSeleccionado] = useState("pendientes");
  const [ticketSeleccionado, setTicketSeleccionado] = useState<ITickets>();

  const [openModalAgregarColaboradores, setOpenModalAgregarColaboradores] = useState(false);
  const [estadoModalDetalles, setEstadoModalDetalles] = useState(false);

  const [ocultarPanelColaboradores, setOcultarPanelColaboradores] = useState(false);
  const [mostarMenuColaboradores, setMostrarMenuColaboradores] = useState(false);

  const [listaTickets, setListaTickets] = useState<ITickets[]>([]);
  const operatorId = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const responseEstados = unwrapResult(await dispatch(TicketEstadosSliceRequets.getAllRequest()));
      if (infoUser) {
        dispatch(ticketsEstadoSlice.actions.setArrayTicketsEstados(responseEstados));
        const responseTickets = unwrapResult(
          await dispatch(
            TicketsSliceRequest.GetTicketsByRolAndColaborador({
              rolId: infoUser.permisos.rolId,
              colaboradorId: infoUser.operatorId,
              plantId: infoUser.operator.plantaId
            })
          )
        );
        if (responseTickets) {
          dispatch(appUserSlice.actions.setObject(infoUser));
          setListaTickets(responseTickets);
        }
      }
    } catch (error) {
      console.log(error);
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const refreshListaTickets = async () => {
    try {
      if (infoUser) {
        dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
        const response = unwrapResult(
          await dispatch(
            TicketsSliceRequest.GetTicketsByRolAndColaborador({
              rolId: infoUser.permisos.rolId,
              colaboradorId: infoUser.operatorId,
              plantId: infoUser.operator.plantaId
            })
          )
        );
        if (response) {
          setListaTickets(response);
        }
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const [listaColaboradores, setListaColaboradores] = useState<ITicketsColaboradoresBloque[]>([]);
  const getColaboradores = async () => {
    try {
      dispatch(LoadingUISlice.actions.LoadingUIOpen("Cargando..."));
      const response = unwrapResult(
        await dispatch(TicketsColaboradoresBloqueSliceRequest.GetAllColabsByTicket(ticketSeleccionado.id))
      );
      if (response) {
        setListaColaboradores(response);
      }
    } catch (error) {
      openNotificationUI(error, "error");
    } finally {
      dispatch(LoadingUISlice.actions.LoadingUIClose());
    }
  };

  const guardarFuncion = (fn: () => Promise<void>) => {
    setFuncionRefresh(() => fn);
  };

  const refreshTicket = async () => {
    if (funcionRefresh) {
      await funcionRefresh();
    } else {
      console.log("El hijo no envio nada");
    }
  };

  //Descomentar esto cuando se ocupe que salga un icono al lado del colaborador para ver su estado
  // const asignarIcono = (estado: string) => {
  //     switch (estado) {
  //         case "aprobado":
  //             return (
  //                 <CheckCircleOutline color="success" />
  //             )
  //         case "ocupado":
  //             return (
  //                 <LoopOutlined color="action" />
  //             )
  //         default:
  //             return (
  //                 <QuestionAnswerOutlined color="warning" />
  //             )
  //     }
  // }

  const cambiarMenu = (componenteSeleccionado: string) => {
    switch (componenteSeleccionado) {
      case "pendientes":
        return (
          <>
            {componenteSeleccionado == "pendientes" && (
              <TikcetsPendientes
                setFunctionRefreshDeleteTickets={refreshListaTickets}
                setFunctionRefresh={guardarFuncion}
                setEstadoModal={setEstadoModalDetalles}
                listaTickets={listaTickets}
                setMostrarColaboradores={setMostrarMenuColaboradores}
                setTicketSeleccionadoLayout={setTicketSeleccionado}
              />
            )}
          </>
        );
      case "cerrados":
        return (
          <>
            {componenteSeleccionado == "cerrados" && (
              <TicketsCerrados
                setFunctionRefresh={guardarFuncion}
                setMostrarColaboradores={setMostrarMenuColaboradores}
                setTicketSeleccionadoLayout={setTicketSeleccionado}
                setEstadoModal={setEstadoModalDetalles}
              />
            )}
          </>
        );
      case "notificaciones":
        return <>{componenteSeleccionado == "notificaciones" && <DestinatariosNotificaciones />}</>;
      case "historial":
        return (
          <>
            {componenteSeleccionado == "historial" && (
              <HistorialAgente
                setFunctionRefresh={guardarFuncion}
                setMostrarColaboradores={setMostrarMenuColaboradores}
                setTicketSeleccionadoLayout={setTicketSeleccionado}
                setEstadoModal={setEstadoModalDetalles}
              />
            )}
          </>
        );
      case "global":
        return (
          <>
            {componenteSeleccionado == "global" && (
              <BusquedaGlobal
                setFunctionRefresh={guardarFuncion}
                setMostrarColaboradores={setMostrarMenuColaboradores}
                setTicketSeleccionadoLayout={setTicketSeleccionado}
                activarModoAgente={true}
              />
            )}
          </>
        );
    }
  };

  useEffect(() => {
    TitleChanger("Panel de Agentes");
    operatorId();
  }, []);

  useEffect(() => {
    if (subMenuSeleccionado == "pendientes") {
      refreshListaTickets();
    }
  }, [subMenuSeleccionado]);

  useEffect(() => {
    if (ocultarPanelColaboradores) {
      getColaboradores();
    }
  }, [ocultarPanelColaboradores]);

  useEffect(() => {
    if (estadoModalDetalles === false) {
      operatorId();
    }
  }, [estadoModalDetalles]);

  useEffect(() => {
    if (subMenuSeleccionado) {
      setMostrarMenuColaboradores(false);
    }
  }, [subMenuSeleccionado]);

  return (
    <main className="w-screen h-[100vh]">
      <header className="w-full border-b border-b-gray-300 pl-4 h-14 flex flex-row items-center shadow-md bg-secondaryNew text-textColor">
        <ul className="flex flex-row items-center gap-5 h-full w-full">
          <li
            onClick={() => {
              setSubMenuSeleccionado("pendientes");
            }}
            className={`${
              subMenuSeleccionado == "pendientes"
                ? "border-b border-b-blue-500 text-blue-500 hover:bg-transparent"
                : "border-none"
            } barraNavegacionLayouts w-[22%]`}>
            <MarkChatUnreadOutlined color={subMenuSeleccionado == "pendientes" ? "primary" : "disabled"} />
            <div>
              <p>Ticket Pendientes</p>
            </div>
          </li>
          <li
            onClick={() => {
              setSubMenuSeleccionado("cerrados");
            }}
            className={`${
              subMenuSeleccionado == "cerrados"
                ? "border-b border-b-blue-500 text-blue-500 hover:bg-transparent"
                : "border-none"
            } barraNavegacionLayouts w-[22%]`}>
            <MarkChatReadOutlined color={subMenuSeleccionado == "cerrados" ? "primary" : "disabled"} />
            <div>
              <p>Tickets Cerrados</p>
            </div>
          </li>
          <li
            onClick={() => {
              setSubMenuSeleccionado("notificaciones");
            }}
            className={`${
              subMenuSeleccionado == "notificaciones"
                ? "border-b border-b-blue-500 text-blue-500 hover:bg-transparent"
                : "border-none"
            } barraNavegacionLayouts w-[22%]`}>
            <NotificationAddOutlined color={subMenuSeleccionado == "notificaciones" ? "primary" : "disabled"} />
            <div>
              <p>Destinatarios Notificaciones</p>
            </div>
          </li>
          <li
            onClick={() => {
              setSubMenuSeleccionado("historial");
            }}
            className={`${
              subMenuSeleccionado == "historial"
                ? "border-b border-b-blue-500 text-blue-500 hover:bg-transparent"
                : "border-none"
            } barraNavegacionLayouts w-[22%]`}>
            <HistoryOutlined color={subMenuSeleccionado == "historial" ? "primary" : "disabled"} />
            <div>
              <p>Historial</p>
            </div>
          </li>
          <li
            onClick={() => {
              setSubMenuSeleccionado("global");
            }}
            className={`${
              subMenuSeleccionado == "global"
                ? "border-b border-b-blue-500 text-blue-500 hover:bg-transparent"
                : "border-none"
            } barraNavegacionLayouts w-[22%]`}>
            <TravelExploreOutlined color={subMenuSeleccionado == "global" ? "primary" : "disabled"} />
            <div>
              <p>Busqueda Global</p>
            </div>
          </li>
        </ul>
      </header>
      <section className="flex flex-row h-full">
        {cambiarMenu(subMenuSeleccionado)}
        {mostarMenuColaboradores && (
          <div
            className={`${
              ocultarPanelColaboradores ? "w-1/4 px-6" : "w-0 px-0"
            } border-l border-l-gray-300 shadow-md relative transition-all duration-300 bg-secondaryNew`}>
            <figure
              onClick={() => {
                setOcultarPanelColaboradores(!ocultarPanelColaboradores);
              }}
              className={`${
                ocultarPanelColaboradores ? "rotate-180" : "rotate-0"
              } absolute right-full top-[5%] w-12 h-12 bg-secondaryNew flex justify-center border border-gray-200 shadow-sm z-20`}>
              <button>
                <ArrowCircleLeftOutlined fontSize="medium" />
              </button>
            </figure>
            <figure
              onClick={() => {
                refreshTicket();
              }}
              className={`absolute right-full top-[10.5%] w-12 h-12 bg-secondaryNew flex justify-center border border-gray-200 shadow-sm z-20`}>
              <button>
                <RefreshRounded color="primary" fontSize="medium" />
              </button>
            </figure>
            <div className="flex flex-row justify-between items-center w-full">
              <h2 className="text-xl my-4">Colaboradores</h2>
              <button
                onClick={() => {
                  setOpenModalAgregarColaboradores(true);
                }}>
                <AddCircleOutlineOutlined fontSize="medium" />
              </button>
            </div>
            {listaColaboradores.map((elementos, index) => (
              <div key={index} className="flex flex-col my-4 bg-secondaryNew">
                <figure className="flex flex-row items-center gap-x-4 bg-secondaryNew rounded-md shadow-sm p-2">
                  <PersonOutline color="error" />
                  <div>
                    <p className="text-textColor">
                      {elementos.colaboradores.name} {elementos.colaboradores.surname}
                    </p>
                    <p className="text-xs text-gray-500">{elementos.colaboradores.position}</p>
                  </div>
                  {/* {asignarIcono(elementos.estado)} */}
                </figure>
              </div>
            ))}
          </div>
        )}
      </section>
      <ModalCompoment
        setOpenPopup={setOpenModalAgregarColaboradores}
        openPopup={openModalAgregarColaboradores}
        title="Agregar Nuevo Colaborador">
        <AgregarColaboradoModal
          setOpenModal={setOpenModalAgregarColaboradores}
          openModal={openModalAgregarColaboradores}
          ticketSeleccionado={ticketSeleccionado}
          setRefresListaColaboradores={setListaColaboradores}
        />
      </ModalCompoment>
    </main>
  );
};
