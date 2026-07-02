import React, { useState } from "react";
import { ListaTicketsComponent } from "../../components/ListaTicketsComponent";
import { ITickets } from "../../models/ITickets";
import { DetallesTikcetModal } from "../../modals/DetallesTicketModal";

interface Props {
  listaTickets: ITickets[];
  setEstadoModal: (newValue: boolean) => void;
  setMostrarColaboradores: (newValue: boolean) => void;
  setTicketSeleccionadoLayout: (newValue: ITickets) => void;
  setFunctionRefresh: (fn: () => Promise<void>) => void;
  setFunctionRefreshDeleteTickets: () => void;
}

export const TikcetsPendientes: React.FC<Props> = ({
  listaTickets,
  setEstadoModal,
  setMostrarColaboradores,
  setTicketSeleccionadoLayout,
  setFunctionRefresh,
  setFunctionRefreshDeleteTickets
}) => {
  const [openModalDetallesTicket, setOpenModalDetallesTicket] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState<ITickets>();

  const abrirModalDetallesTicket = (estadoAbrir) => {
    setOpenModalDetallesTicket(estadoAbrir);
    setEstadoModal(estadoAbrir);
    setMostrarColaboradores(estadoAbrir);
  };

  const seleccionarTicket = (ticket) => {
    setTicketSeleccionado(ticket);
    setTicketSeleccionadoLayout(ticket);
  };

  return (
    <main className="w-full h-full p-4">
      <section className="w-full h-full overflow-auto rounded-b-md border-t-4 border-t-red-500 p-4 shadow-xl border-x border-x-gray-50 border-b border-b-gray-50 relative bg-secondaryNew">
        <div className="w-full h-[90%] overflow-auto mt-3">
          <ListaTicketsComponent
            accionesTickets={{ habilitarEliminar: true, verTrazabilidad: true }}
            setFunctionRefresh={setFunctionRefreshDeleteTickets}
            mostrarSiguienteRol
            mostrarResponsable
            activarMostrarDetalles
            setTicketSeleccionado={seleccionarTicket}
            listaTickets={listaTickets}
            openModal={openModalDetallesTicket}
            setOpenModal={abrirModalDetallesTicket}
          />
        </div>
        {openModalDetallesTicket && (
          <DetallesTikcetModal
            esUsuarioAgente={true}
            setFunctionRefresh={setFunctionRefresh}
            setTicketSeleecionado={setTicketSeleccionado}
            ticketSeleccionado={ticketSeleccionado}
            openModal={openModalDetallesTicket}
            setOpenModal={abrirModalDetallesTicket}
          />
        )}
      </section>
    </main>
  );
};
