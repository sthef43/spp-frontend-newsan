import { useAppDispatch, useAppSelector } from "app/core/store/store";
import FetchApi from "app/shared/helpers/FetchApi";
import React, { useState } from "react";
import { ListaTicketsComponent } from "../../components/ListaTicketsComponent";
import { ITickets } from "../../models/ITickets";
import { DetallesTikcetModal } from "../../modals/DetallesTicketModal";
import { TicketsSliceRequest } from "app/features/tickets/reducers/TicketsSlice";
import { IAppUser } from "app/models";
import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingUISlice } from "app/Middleware/reducers/LoadingUISlice";
import { useNotificationUI } from "app/shared/hooks/useNotificationUI";

interface Props {
  setMostrarColaboradores: (newValue: boolean) => void;
  setTicketSeleccionadoLayout: (newValue: ITickets) => void;
  setFunctionRefresh: (fn: () => Promise<void>) => void;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const TicketCreados: React.FC<Props> = ({
  setMostrarColaboradores,
  setTicketSeleccionadoLayout,
  setFunctionRefresh
}) => {
  const dispatch = useAppDispatch();
  const { openNotificationUI } = useNotificationUI();

  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  const [openModalDetallesTicket, setOpenModalDetallesTicket] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState<ITickets>();

  const abrirModalDetallesTicket = (estadoAbrir) => {
    setOpenModalDetallesTicket(estadoAbrir);
    setMostrarColaboradores(estadoAbrir);
  };

  const seleccionarTicket = (ticket) => {
    setTicketSeleccionado(ticket);
    setTicketSeleccionadoLayout(ticket);
  };

  //Lista de tickets hasta que tengamos las tablas creadas
  const [listaTickets, setListaTickets] = useState<ITickets[]>([]);
  FetchApi<ITickets[]>(
    TicketsSliceRequest.GetAllTicketsByOperatorId,
    infoUser.operatorId,
    false,
    openModalDetallesTicket,
    setListaTickets
  );

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

  return (
    <main className="w-full h-full p-4">
      <section className="w-full rounded-b-md border-t-4 border-t-red-500 p-4 h-full shadow-xl border-x border-x-gray-50 border-b border-b-gray-50 relative bg-secondaryNew">
        {listaTickets && listaTickets.length > 0 && (
          <div className="h-[90%]">
            <ListaTicketsComponent
              accionesTickets={{ habilitarEliminar: true, verTrazabilidad: true }}
              setFunctionRefresh={refreshListaTickets}
              mostrarSiguienteRol
              activarMostrarDetalles
              setTicketSeleccionado={seleccionarTicket}
              listaTickets={listaTickets}
              openModal={openModalDetallesTicket}
              setOpenModal={abrirModalDetallesTicket}
            />
          </div>
        )}
        {openModalDetallesTicket && (
          <DetallesTikcetModal
            esUsuarioAgente={false}
            setFunctionRefresh={setFunctionRefresh}
            ticketSeleccionado={ticketSeleccionado}
            setTicketSeleecionado={setTicketSeleccionado}
            openModal={openModalDetallesTicket}
            setOpenModal={abrirModalDetallesTicket}
          />
        )}
      </section>
    </main>
  );
};
