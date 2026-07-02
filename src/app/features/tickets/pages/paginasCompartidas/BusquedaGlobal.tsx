import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ITickets } from "../../models/ITickets";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import FetchApi from "app/shared/helpers/FetchApi";
import { ListaTicketsComponent } from "../../components/ListaTicketsComponent";
import { DetallesTikcetModal } from "../../modals/DetallesTicketModal";
import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";
import { TicketsSliceRequest } from "../../reducers/TicketsSlice";

interface Props {
  setMostrarColaboradores: (newValue: boolean) => void;
  setTicketSeleccionadoLayout: (newValue: ITickets) => void;
  activarModoAgente: boolean;
  setFunctionRefresh: (fn: () => Promise<void>) => void;
}

export const BusquedaGlobal: React.FC<Props> = ({
  setMostrarColaboradores,
  setTicketSeleccionadoLayout,
  activarModoAgente,
  setFunctionRefresh
}) => {
  const { control, watch, setValue } = useForm();

  const watchNumeroSd = watch("busquedaTicket");
  const [openModalDetallesTicket, setOpenModalDetallesTicket] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState<ITickets>();

  const { debounceTime } = UseUtilHooks();
  const activarBusqueda = debounceTime(watchNumeroSd, 500);

  const [tickets, setTickets] = useState<ITickets[]>([]);
  FetchApi<ITickets[]>(
    TicketsSliceRequest.SearchTicketBySdOption,
    watchNumeroSd,
    false,
    activarBusqueda,
    setTickets,
    true
  );

  const abrirModalDetallesTicket = (estadoAbrir) => {
    setOpenModalDetallesTicket(estadoAbrir);
    setMostrarColaboradores(estadoAbrir);
    setValue("busquedaTicket", "");
    setTickets([]);
  };

  const seleccionarTicket = (ticket) => {
    setTicketSeleccionado(ticket);
    setTicketSeleccionadoLayout(ticket);
    setValue("busquedaTicket", "");
    setTickets([]);
  };

  return (
    <main className="w-full h-full p-4">
      <section className="w-full rounded-b-md border-t-4 border-t-red-500 p-4 h-full shadow-xl border-x border-x-gray-50 border-b border-b-gray-50 relative bg-secondaryNew">
        <div className="flex flex-col justify-start items-start w-full">
          <TextFieldComponent
            control={control}
            index={0}
            nameInput="busquedaTicket"
            valueDefault=""
            labelInput="Ingrese un codigo SD"
          />
        </div>
        <div className="mt-4 h-[85%]">
          <ListaTicketsComponent
            mostrarSiguienteRol
            activarMostrarDetalles
            setTicketSeleccionado={seleccionarTicket}
            listaTickets={tickets}
            openModal={openModalDetallesTicket}
            setOpenModal={abrirModalDetallesTicket}
          />
        </div>
        {openModalDetallesTicket && (
          <DetallesTikcetModal
            setFunctionRefresh={setFunctionRefresh}
            esHistorial={activarModoAgente}
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
