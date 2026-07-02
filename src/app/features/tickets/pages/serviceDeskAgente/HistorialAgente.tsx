/* eslint-disable unused-imports/no-unused-vars */
import { useAppSelector } from "app/core/store/store";
import { TextFieldComponent } from "app/features/cli/Components/TextFieldComponente";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ListaTicketsComponent } from "../../components/ListaTicketsComponent";
import { SelectCategoriaComponent } from "../../components/SelectCategoriaComponent";
import { SelectEstadoComponent } from "../../components/SelectEstadoComponent";
import { ITickets } from "../../models/ITickets";
import { DetallesTikcetModal } from "../../modals/DetallesTicketModal";
import { TicketsSliceRequest } from "app/features/tickets/reducers/TicketsSlice";
import { IAppUser } from "app/models";
import FetchApi from "app/shared/helpers/FetchApi";
import { useDateRangeValidation } from "app/features/seguridadEHigiene/auditoriasPersonal/hooks/useDateRangeValidation";
import moment from "moment";
import { Button } from "@mui/material";

interface Props {
  setEstadoModal: (newValue: boolean) => void;
  setMostrarColaboradores: (newValue: boolean) => void;
  setTicketSeleccionadoLayout: (newValue: ITickets) => void;
  setFunctionRefresh: (fn: () => Promise<void>) => void;
}

export const HistorialAgente: React.FC<Props> = ({
  setEstadoModal,
  setMostrarColaboradores,
  setTicketSeleccionadoLayout,
  setFunctionRefresh
}) => {
  const { control, watch } = useForm();

  const infoUser: IAppUser = useAppSelector<IAppUser>((state) => state.appUser.data as any);

  const [desde, setDesde] = useState(moment().add(-1, "day").toDate());
  const [hasta, setHasta] = useState(moment().toDate());
  const { errors, isInvalid } = useDateRangeValidation(desde, hasta);

  const watchClienteInput = watch("cliente");
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState(null);

  const [openModalDetallesTicket, setOpenModalDetallesTicket] = useState(false);
  const [ticketSeleccionado, setTicketSeleccionado] = useState<ITickets>();

  const [listTicketsFiltrado, setListTicketsFiltrado] = useState<ITickets[]>([]);
  const [listaTickets, setListaTickets] = useState<ITickets[]>([]);
  FetchApi<ITickets[]>(
    TicketsSliceRequest.GetAllTicketsByPlantOperatorInclusiveClosedTickets,
    infoUser.operator.plantaId,
    false,
    null,
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

  const resetFiltros = () => {
    setCategoriaSeleccionada(null);
    setEstadoSeleccionado(null);
    control._reset();
    setListTicketsFiltrado(listaTickets);
  };

  useEffect(() => {
    let ticketsFiltrados = listaTickets;
    if (watchClienteInput) {
      ticketsFiltrados = ticketsFiltrados.filter(
        (ticket) =>
          ticket.operator.name.toLowerCase().includes(watchClienteInput.toLowerCase()) ||
          ticket.operator.surname.toLowerCase().includes(watchClienteInput.toLowerCase())
      );
    }
    if (categoriaSeleccionada) {
      ticketsFiltrados = ticketsFiltrados.filter((ticket) => ticket.ticketsCategoriaId === categoriaSeleccionada);
    }
    if (estadoSeleccionado) {
      if (estadoSeleccionado == 1) {
        ticketsFiltrados = ticketsFiltrados.filter((ticket) => ticket.ticketsEstadoId !== 1);
      } else {
        ticketsFiltrados = ticketsFiltrados.filter((ticket) => ticket.ticketsEstadoId === estadoSeleccionado);
      }
    }
    // if (desde && hasta) {
    //   ticketsFiltrados = ticketsFiltrados.filter(
    //     (ticket) =>
    //       moment(ticket.createdDate).isSameOrAfter(moment(desde)) &&
    //       moment(ticket.createdDate).isSameOrBefore(moment(hasta))
    //   );
    // }
    setListTicketsFiltrado(ticketsFiltrados);
  }, [watchClienteInput, categoriaSeleccionada, listaTickets, estadoSeleccionado]);

  return (
    <main className="w-full h-full p-4">
      <section className="w-full rounded-b-md border-t-4 border-t-red-500 p-4 h-full shadow-xl border-x border-x-gray-50 border-b border-b-gray-50 relative bg-secondaryNew">
        <div className="w-full flex flex-col gap-y-4">
          {/* <div className="flex flex-row items-center gap-x-4">
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
          </div> */}
          <div className="flex flex-row items-center gap-x-4">
            <div className="flex flex-col justify-start items-start w-full">
              <p className="text-xs text-gray-500 mb-3">Tipo de Solicitud (Categoría)</p>
              <SelectCategoriaComponent
                activeControl={true}
                controlPadre={control}
                filtroPorPlanta
                plantId={infoUser.operator.plantaId}
                setCategoriaSeleciconadaId={setCategoriaSeleccionada}
              />
            </div>
            <div className="flex flex-col justify-start items-start w-full">
              <p className="text-xs text-gray-500 mb-3">Cliente</p>
              <TextFieldComponent control={control} index={0} nameInput="cliente" valueDefault="" labelInput="" />
            </div>
            <div className="flex flex-col justify-start items-start w-full">
              <p className="text-xs text-gray-500 mb-3">Estado</p>
              <SelectEstadoComponent
                activeControl
                controlPadre={control}
                setEstadoSeleccionado={setEstadoSeleccionado}
              />
            </div>
          </div>
        </div>
        <div className="my-5 flex flex-row gap-x-2 items-center">
          <Button variant="contained" color="primary" onClick={() => resetFiltros()}>
            Reset Filtros
          </Button>
          {/* <Button className={buttonClases.greenButtonTickets} disabled={categoriaSeleccionada === null || datePickerValue === null || estadoSeleccionado === null || watchClienteInput === '' || listaTickets.length == 0 }>
                        <FileDownloadOutlined fontSize="small"/>
                        Exportar
                    </Button>
                    <Button className={buttonClases.purpleButtonTickets} disabled={categoriaSeleccionada === null || datePickerValue === null || estadoSeleccionado === null || watchClienteInput === '' || listaTickets.length == 0}>
                        <LocalPrintshopOutlined fontSize="small"/>
                        Imprimir
                    </Button> */}
        </div>
        <div className="w-full h-[80%]">
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
