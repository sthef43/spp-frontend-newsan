/* eslint-disable unused-imports/no-unused-vars */
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ListaTicketsComponent } from "../../components/ListaTicketsComponent";
import { ITickets } from "../../models/ITickets";
import { TicketsSliceRequest } from "app/features/tickets/reducers/TicketsSlice";
import { SelectCategoriaComponent } from "../../components/SelectCategoriaComponent";
import { useAppSelector } from "app/core/store/store";
import { DetallesTikcetModal } from "../../modals/DetallesTicketModal";
import { IAppUser } from "app/models";
import FetchApi from "app/shared/helpers/FetchApi";
import { InputDatePicker } from "app/features/seguridadEHigiene/auditoriasPersonal/components/InputDatePicker";
import moment from "moment";
import { useDateRangeValidation } from "app/features/seguridadEHigiene/auditoriasPersonal/hooks/useDateRangeValidation";

interface Props {
  setEstadoModal: (newValue: boolean) => void;
  setMostrarColaboradores: (newValue: boolean) => void;
  setTicketSeleccionadoLayout: (newValue: ITickets) => void;
  setFunctionRefresh: (fn: () => Promise<void>) => void;
}

export const TicketsCerrados: React.FC<Props> = ({
  setEstadoModal,
  setMostrarColaboradores,
  setTicketSeleccionadoLayout,
  setFunctionRefresh
}) => {
  const { control, watch, setValue } = useForm();

  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);
  const clienteIngresado: string = watch("cliente");

  const [desde, setDesde] = useState(moment().add(-1, "day").toDate());
  const [hasta, setHasta] = useState(moment().toDate());
  const { errors, isInvalid } = useDateRangeValidation(desde, hasta);

  const [openModalDetallesTicket, setOpenModalDetallesTicket] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState<ITickets>();

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const [listTicketsFiltrado, setListTicketsFiltrado] = useState<ITickets[]>([]);
  const [listaTickets, setListaTickets] = useState<ITickets[]>([]);
  FetchApi(
    TicketsSliceRequest.GetAllTicketsClose,
    { plantId: infoUser.operator.plantaId, fechaDesde: moment(desde).format(), fechaHasta: moment(hasta).format() },
    false,
    moment(desde).format() || moment(hasta).format(),
    setListaTickets,
    false
  );

  const abrirModalDetallesTicket = (estadoAbrir) => {
    setOpenModalDetallesTicket(estadoAbrir);
    setEstadoModal(estadoAbrir);
    setMostrarColaboradores(estadoAbrir);
  };

  const seleccionarTicket = (ticket) => {
    setTicketSeleccionado(ticket);
    setTicketSeleccionadoLayout(ticket);
  };

  useEffect(() => {
    setValue("categoria", 0);
  }, []);

  useEffect(() => {
    let ticketsFiltrados = listaTickets;
    if (clienteIngresado) {
      ticketsFiltrados = ticketsFiltrados.filter((ticket) =>
        ticket.operator.name.toLowerCase().includes(clienteIngresado.toLowerCase())
      );
    }
    if (categoriaSeleccionada) {
      ticketsFiltrados = ticketsFiltrados.filter((ticket) => ticket.ticketsCategoriaId === categoriaSeleccionada);
    }
    setListTicketsFiltrado(ticketsFiltrados);
  }, [clienteIngresado, categoriaSeleccionada, listaTickets]);

  return (
    <main className="w-full h-full p-4">
      <section className="w-full rounded-b-md border-t-4 border-t-red-500 p-4 h-full shadow-xl border-x border-x-gray-50 border-b border-b-gray-50 relative bg-secondaryNew">
        <div className="w-full gap-x-4 flex flex-row items-center">
          <div className="flex flex-col justify-start items-start w-full">
            <p className="text-xs text-gray-500 mb-3">Fecha Desde</p>
            <InputDatePicker
              variantStyle="outlined"
              label=""
              setDate={setDesde}
              defaultValue={desde}
              maxDate={hasta}
              error={errors.startDate.hasError}
              helperText={errors.startDate.message}
            />
          </div>
          <div className="flex flex-col justify-start items-start w-full">
            <p className="text-xs text-gray-500 mb-3">Fecha Hasta</p>
            <InputDatePicker
              variantStyle="outlined"
              label=""
              setDate={setHasta}
              defaultValue={hasta}
              minDate={desde}
              error={errors.endDate.hasError}
              helperText={errors.endDate.message}
            />
          </div>
          <div className="flex flex-col justify-start items-start w-full">
            <p className="text-xs text-gray-500 mb-3">Filtrar por Categoría</p>
            <SelectCategoriaComponent
              filtroPorPlanta
              plantId={infoUser.operator.plantaId}
              setCategoriaSeleciconadaId={setCategoriaSeleccionada}
            />
          </div>
          <div className="flex flex-col justify-start items-start w-full">
            <p className="text-xs text-gray-500 mb-3">Filtrar por Cliente</p>
            <TextFieldComponent labelInput="" nameInput="cliente" index={0} control={control} valueDefault="" />
          </div>
        </div>
        <div className="mt-4">
          <ListaTicketsComponent
            accionesTickets={{ habilitarEliminar: false, verTrazabilidad: true }}
            activarMostrarDetalles
            setTicketSeleccionado={seleccionarTicket}
            listaTickets={listTicketsFiltrado}
            openModal={openModalDetallesTicket}
            setOpenModal={abrirModalDetallesTicket}
          />
        </div>
        {openModalDetallesTicket && (
          <DetallesTikcetModal
            setFunctionRefresh={setFunctionRefresh}
            esUsuarioAgente
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
