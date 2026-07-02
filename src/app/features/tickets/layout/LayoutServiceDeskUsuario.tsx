import {
  AddCircleOutlineOutlined,
  ArrowCircleLeftOutlined,
  HistoryOutlined,
  MessageOutlined,
  PersonOutline,
  RefreshRounded,
  TravelExploreOutlined
} from "@mui/icons-material";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useAppDispatch } from "app/core/store/store";
import { ModalCompoment } from "app/shared/components/ModalComponent";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";
import useTitleOfApp from "app/shared/hooks/UseTitleOfApp";
import React, { useEffect, useState } from "react";
import { ITickets } from "../models/ITickets";
import { ITicketsColaboradoresBloque } from "../models/ITicketsColaboradoresBloque";
import { AgregarColaboradoModal } from "../modals/DetallesTicketModal/AgregarColaboradorModal";
import { CrearTickets } from "../pages/serviceDeskUsuario/CrearTickets";
import { HistorialPage } from "../pages/serviceDeskUsuario/HistorialPage";
import { NotificacionesPage } from "../pages/serviceDeskUsuario/NotoficacionesPage";
import { TicketCreados } from "../pages/serviceDeskUsuario/TicketsCreados";
import { BusquedaGlobal } from "../pages/paginasCompartidas/BusquedaGlobal";
import { TicketsColaboradoresBloqueSliceRequest } from "../reducers/TicketsColaboradoresBloqueSlice";
import FetchApi from "app/shared/helpers/FetchApi";
import { ITicketsEstados } from "../models/ITicketsEstado";
import { TicketEstadosSliceRequets, ticketsEstadoSlice } from "../reducers/TicketsEstado.service";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const LayoutServiceDeskUsuario = () => {
  const { TitleChanger } = useTitleOfApp();
  const { openNotificationUI } = useNotificationUI();
  const dispatch = useAppDispatch();

  const [funcionRefresh, setFuncionRefresh] = useState<(() => Promise<void>) | null>(null);

  const [subMenuSeleccionado, setSubMenuSeleccionado] = useState("crear");
  const [ticketSeleccionado, setTicketSeleccionado] = useState<ITickets>();

  const [ocultarPanelColaboradores, setOcultarPanelColaboradores] = useState(false);
  const [mostarMenuColaboradores, setMostrarMenuColaboradores] = useState(false);
  const [openModalAgregarColaboradores, setOpenModalAgregarColaboradores] = useState(false);

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

  FetchApi<ITicketsEstados[]>(TicketEstadosSliceRequets.getAllRequest, null, false, null, null, false, false, false);

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

  const cambiarMenu = (componenteSeleccionado: string) => {
    switch (componenteSeleccionado) {
      case "crear":
        return <>{componenteSeleccionado == "crear" && <CrearTickets />}</>;
      case "creados":
        return (
          <>
            {componenteSeleccionado == "creados" && (
              <TicketCreados
                setFunctionRefresh={guardarFuncion}
                setMostrarColaboradores={setMostrarMenuColaboradores}
                setTicketSeleccionadoLayout={setTicketSeleccionado}
              />
            )}
          </>
        );
      case "notificaciones":
        return <>{componenteSeleccionado == "notificaciones" && <NotificacionesPage />}</>;
      case "historial":
        return (
          <>
            {componenteSeleccionado == "historial" && (
              <HistorialPage
                setFunctionRefresh={guardarFuncion}
                setMostrarColaboradores={setMostrarMenuColaboradores}
                setTicketSeleccionadoLayout={setTicketSeleccionado}
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
    TitleChanger("Service Desk");
  }, []);

  useEffect(() => {
    if (ocultarPanelColaboradores) {
      getColaboradores();
    }
  }, [ocultarPanelColaboradores]);

  useEffect(() => {
    if (subMenuSeleccionado) {
      setMostrarMenuColaboradores(false);
    }
  }, [subMenuSeleccionado]);

  return (
    <main className="w-screen h-[100vh]">
      <header className="w-full border-b border-b-gray-300 pl-4 h-14 flex flex-row items-center shadow-md text-textColor bg-secondaryNew">
        <ul className="flex flex-row items-center gap-5 h-full w-[70%]">
          <li
            onClick={() => {
              setSubMenuSeleccionado("crear");
            }}
            className={`${
              subMenuSeleccionado == "crear"
                ? "border-b border-b-blue-500 text-blue-500 hover:bg-transparent"
                : "border-none"
            } barraNavegacionLayouts`}>
            <AddCircleOutlineOutlined color={subMenuSeleccionado == "crear" ? "primary" : "disabled"} />
            <div>
              <p>Crear Ticket</p>
            </div>
          </li>
          <li
            onClick={() => {
              setSubMenuSeleccionado("creados");
            }}
            className={`${
              subMenuSeleccionado == "creados"
                ? "border-b border-b-blue-500 text-blue-500 hover:bg-transparent"
                : "border-none"
            } barraNavegacionLayouts`}>
            <MessageOutlined color={subMenuSeleccionado == "creados" ? "primary" : "disabled"} />
            <div>
              <p>Tickets Creados</p>
            </div>
          </li>
          {/* <li onClick={() => { setSubMenuSeleccionado("notificaciones") }} className={`${subMenuSeleccionado == "notificaciones" ? 'border-b border-b-blue-500 text-blue-500 hover:bg-transparent' : 'border-none'} barraNavegacionLayouts`}>
                        <NotificationsOutlined color={subMenuSeleccionado == "notificaciones" ? "primary" : "disabled"} />
                        <div>
                            <p>Notificaciones</p>
                        </div>
                    </li> */}
          <li
            onClick={() => {
              setSubMenuSeleccionado("historial");
            }}
            className={`${
              subMenuSeleccionado == "historial"
                ? "border-b border-b-blue-500 text-blue-500 hover:bg-transparent"
                : "border-none"
            } barraNavegacionLayouts`}>
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
            } barraNavegacionLayouts`}>
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
            } border-l border-l-gray-300 shadow-md relative transition-all duration-300 z-20`}>
            <figure
              onClick={() => {
                setOcultarPanelColaboradores(!ocultarPanelColaboradores);
              }}
              className={`${
                ocultarPanelColaboradores ? "rotate-180" : "rotate-0"
              } absolute right-full top-[5%] w-12 h-12 bg-secondaryNew flex justify-center border border-gray-200 shadow-sm`}>
              <button>
                <ArrowCircleLeftOutlined fontSize="medium" />
              </button>
            </figure>
            <figure
              onClick={() => {
                refreshTicket();
              }}
              className={`absolute right-full w-12 h-12 top-[6vw] bg-secondaryNew flex justify-center border border-gray-200 shadow-sm z-20`}>
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
