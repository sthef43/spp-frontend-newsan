/* eslint-disable unused-imports/no-unused-vars */
import { useAppSelector } from "app/core/store/store";
import { IAppUser } from "app/models";
import FetchApi from "app/shared/helpers/FetchApi";
import React, { FC, useEffect, useState } from "react";
import { ListaTicketsComponent } from "../../components/ListaTicketsComponent";
import { SelectCategoriaComponent } from "../../components/SelectCategoriaComponent";
import { SelectEstadoComponent } from "../../components/SelectEstadoComponent";
import { DetallesTikcetModal } from "../../modals/DetallesTicketModal";
import { ITickets } from "../../models/ITickets";
import { TicketsSliceRequest } from "app/features/tickets/reducers/TicketsSlice";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";

interface Props {
  setMostrarColaboradores: (newValue: boolean) => void;
  setTicketSeleccionadoLayout: (newValue: ITickets) => void;
  setFunctionRefresh: (fn: () => Promise<void>) => void;
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const HistorialPage: FC<Props> = ({
  setMostrarColaboradores,
  setTicketSeleccionadoLayout,
  setFunctionRefresh
}) => {
  const { control, setValue, watch } = useForm();
  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  // const [desde, setDesde] = useState(moment().add(-1, "day").toDate());
  // const [hasta, setHasta] = useState(moment().toDate());

  // const dispatch = useAppDispatch();
  // const { openNotificationUI } = useNotificationUI();
  // const { errors, isInvalid } = useDateRangeValidation(desde, hasta);

  // const [fechaFormateada, setFechaFormateada] = useState("");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);

  const [openModalDetallesTicket, setOpenModalDetallesTicket] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState<ITickets>();

  const [listTicketsFiltrado, setListTicketsFiltrado] = useState<ITickets[]>([]);
  const [listaTickets, setListaTickets] = useState<ITickets[]>([]);
  FetchApi<ITickets[]>(
    TicketsSliceRequest.GetAllTicketsByOperatorIdInclusiveClosed,
    infoUser.operatorId,
    false,
    infoUser.operatorId,
    setListaTickets,
    true
  );

  const abrirModalDetallesTicket = (estadoAbrir) => {
    setOpenModalDetallesTicket(estadoAbrir);
    setMostrarColaboradores(estadoAbrir);
  };

  const seleccionarTicket = (ticket) => {
    setTicketSeleccionado(ticket);
    setTicketSeleccionadoLayout(ticket);
  };

  useEffect(() => {
    let ticketsFiltrados = listaTickets;
    if (categoriaSeleccionada) {
      ticketsFiltrados = ticketsFiltrados.filter((ticket) => ticket.ticketsCategoriaId === categoriaSeleccionada);
    }
    if (estadoSeleccionado) {
      ticketsFiltrados = ticketsFiltrados.filter((ticket) => ticket.ticketsEstadoId === estadoSeleccionado);
    }
    setListTicketsFiltrado(ticketsFiltrados);
  }, [categoriaSeleccionada, estadoSeleccionado, listaTickets]);

  const resetFiltros = () => {
    setValue("categoria", null);
    setValue("estados", null);
    setCategoriaSeleccionada(null);
    setEstadoSeleccionado(null);
    setListTicketsFiltrado(listaTickets);
  };

  return (
    <main className="w-full h-full p-4">
      <section className="w-full rounded-b-md border-t-4 border-t-red-500 p-4 h-full shadow-xl border-x border-x-gray-50 border-b border-b-gray-50 relative bg-secondaryNew">
        <div className="w-full flex flex-row items-center gap-x-3">
          {/* <div className="flex flex-col justify-start items-start w-full">
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
          </div> */}
          {/* <div className="flex flex-col justify-start items-start w-full">
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
          </div> */}
          <div className="flex flex-col justify-start items-start w-full">
            <p className="text-xs text-gray-500 mb-3">Filtrar por Categoría</p>
            <SelectCategoriaComponent
              filtroPorPlanta
              activeControl
              controlPadre={control}
              plantId={infoUser.operator.plantaId}
              eliminarItemTodos
              setCategoriaSeleciconadaId={setCategoriaSeleccionada}
            />
          </div>
          <div className="flex flex-col justify-start items-start w-full">
            <p className="text-xs text-gray-500 mb-3">Filtrar por Estado</p>
            <SelectEstadoComponent
              activeControl
              controlPadre={control}
              eliminarItemTodos
              setEstadoSeleccionado={setEstadoSeleccionado}
            />
          </div>
        </div>
        <div className="flex flex-col mt-4 justify-start items-start w-full">
          <Button variant="contained" color="primary" onClick={() => resetFiltros()}>
            Reset Filtros
          </Button>
        </div>
        <div className="mt-4 h-[90%]">
          <ListaTicketsComponent
            accionesTickets={{ habilitarEliminar: false, verTrazabilidad: true }}
            mostrarResponsable
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
            esHistorial
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
