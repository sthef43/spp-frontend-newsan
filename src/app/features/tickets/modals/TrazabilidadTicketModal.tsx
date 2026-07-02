/* eslint-disable unused-imports/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ITickets } from "../models/ITickets";
import { UseUtilHooks } from "app/shared/hooks/useUtilsHooks";
import { CloseRounded, FilterAltRounded, SearchRounded } from "@mui/icons-material";
import { ITicketsTrazabilidad } from "../models/ITicketsTrazabilidad";
import FetchApi from "app/shared/helpers/FetchApi";
import { StepperTrazaTicket } from "../components/StepperTrazaTicket";
import { Pagination, Stack } from "@mui/material";
import { Dropdowns } from "../components/Dropdowns";
import { IAgrupacionTrazabilidadTicketsDTO } from "../models/DTOS/IAgrupacionTrazabilidadTicketsDTO";
import { TicketsTrazabilidadSliceRequest } from "app/features/tickets/reducers/TicketsTrazabilidadSlice";
import { SkeletonComponent } from "app/shared/helpers/Layouts/Skeleton/SkeletonComponent";

interface Props {
  openModal: boolean;
  ticketSeleccionado: ITickets;
  setOpenModal: (newValue: boolean) => void;
}

export const TrazabilidadTicketModal: React.FC<Props> = ({ setOpenModal, openModal, ticketSeleccionado }) => {
  const { control } = useForm();

  const { formatDateHourOrMinutes, pagination } = UseUtilHooks<ITicketsTrazabilidad>();

  const [paginaActual, setPaginaActual] = useState<number>(1);

  const [posicionSeleccionada, setPosicionSeleccionada] = useState<string>("");
  const [agenteSeleccionado, setAgenteSeleccionado] = useState<string>("");

  const [indexPosicion, setIndexPosicion] = useState<number>(0);
  const [indexAgente, setIndexAgente] = useState<number>(0);

  const [opcionesFiltrado, setOpcionesFiltrado] = useState<{ value: string; selectMenu: string }>({
    value: "",
    selectMenu: ""
  });

  const [trazaTicket, setTrazaTicket] = useState<IAgrupacionTrazabilidadTicketsDTO>();
  const [trazaTicketFiltrada, setTrazaTicketFiltrada] = useState<IAgrupacionTrazabilidadTicketsDTO>();
  FetchApi<IAgrupacionTrazabilidadTicketsDTO>(
    TicketsTrazabilidadSliceRequest.GetAllTracesOfTicketsGroup,
    ticketSeleccionado.id,
    false,
    openModal,
    setTrazaTicket,
    true,
    true,
    true,
    (data) => {
      setTrazaTicketFiltrada(data);
    }
  );

  const { itemActuales, totalPaginas } = pagination(trazaTicketFiltrada?.ticketsTrazabilidad, 4, paginaActual);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginaActual(value);
  };

  const handleSelection = (option: string, index: string) => {
    setOpcionesFiltrado({ value: option, selectMenu: index });
  };

  const handlePosicionSeleccionada = (option: string, index: number) => {
    setPosicionSeleccionada(option);
    setIndexPosicion(index);
    setAgenteSeleccionado("");
    setIndexAgente(0);
  };

  const handleAgenteSeleccionado = (option: string, index: number) => {
    setAgenteSeleccionado(option);
    setIndexAgente(index);
  };

  const limpiarFiltros = () => {
    setPosicionSeleccionada("");
    setAgenteSeleccionado("");
    setOpcionesFiltrado({ value: "", selectMenu: "" });
    setIndexPosicion(0);
    setIndexAgente(0);
    setTrazaTicketFiltrada(trazaTicket);
  };

  useEffect(() => {
    if (opcionesFiltrado.selectMenu.trim() === "Posicion:") {
      const filtradoPorPosicion: IAgrupacionTrazabilidadTicketsDTO = {
        ...trazaTicket,
        ticketsTrazabilidad: trazaTicket?.ticketsTrazabilidad.filter(
          (ticket) => ticket.operator.position === opcionesFiltrado.value
        )
      };
      setTrazaTicketFiltrada(filtradoPorPosicion);
      setPaginaActual(1);
    }

    if (opcionesFiltrado.selectMenu.trim() === "Agente:") {
      const filtradoPorAgente: IAgrupacionTrazabilidadTicketsDTO = {
        ...trazaTicket,
        ticketsTrazabilidad: trazaTicket?.ticketsTrazabilidad.filter((ticket) => {
          const agente = ticket.operator.name + " " + ticket.operator.surname;
          if (agente === agenteSeleccionado && ticket.operator.position === posicionSeleccionada) {
            return ticket;
          }
        })
      };
      setTrazaTicketFiltrada(filtradoPorAgente);
      setPaginaActual(1);
    }
  }, [opcionesFiltrado, trazaTicket]);

  return (
    <main className="w-[85vw] h-full flex flex-col items-start">
      <section className="w-full flex flex-col items-start">
        <div className="flex flex-row items-center gap-x-4 w-full justify-between">
          <p className="bg-gray-300/50 py-1 px-2 rounded-xl font-semibold">
            {ticketSeleccionado.ticketsCategoria.nombre}
          </p>
          <p className="text-gray-400 text-sm ">
            {formatDateHourOrMinutes({
              optionDate: "fullDate",
              optionHour: "fechaBaseDatos",
              fechaIngresada: ticketSeleccionado.createdDate
            })}
          </p>
        </div>
        <div className="w-full my-2">
          <h2 className="text-2xl font-semibold">Ticket: {ticketSeleccionado.sdTicket}</h2>
        </div>
        <div className="w-full flex justify-between items-center">
          <div>
            <p className="text-gray-400/60 text-xl font-light">{ticketSeleccionado.titulo}</p>
          </div>
          <div>
            <Stack spacing={2}>
              <Pagination
                color="primary"
                page={paginaActual}
                count={totalPaginas}
                variant="outlined"
                shape="rounded"
                onChange={handleChange}
              />
            </Stack>
          </div>
        </div>
      </section>
      <section className="w-full p-4 bg-background shadow-md rounded-md my-4 flex flex-row items-center gap-x-4">
        <div className="flex flex-row items-center gap-x-2 border-r border-gray-400 pr-2">
          <FilterAltRounded />
          <p>Filtrar</p>
        </div>
        <div className="w-full flex flex-row items-center gap-x-2">
          <div className="flex flex-row items-center gap-x-2 w-full border border-gray-300/50 rounded-full bg-gray-300/50 p-2 transition-all duration-200 has-[:focus]:border-blue-500/60">
            <SearchRounded />
            <input
              type="text"
              placeholder="Buscar por agente, tarea, tipo tarea"
              className="w-full bg-transparent outline-none"
            />
          </div>
          <div className="flex flex-row items-center gap-x-2 w-full justify-between">
            <Dropdowns
              options={trazaTicketFiltrada?.listaPosiciones}
              indexSelected={indexPosicion}
              onOptionSelect={(data) => {
                handleSelection(data.value, data.selectMenu);
              }}
              posicionSeleccionada={handlePosicionSeleccionada}
              labelSelect="Posicion: "
            />
            <Dropdowns
              options={trazaTicketFiltrada?.operators.map((operator) => `${operator.name} ${operator.surname}`)}
              indexSelected={indexAgente}
              onOptionSelect={(data) => {
                handleSelection(data.value, data.selectMenu);
              }}
              agenteSeleccionado={handleAgenteSeleccionado}
              labelSelect="Agente: "
            />
          </div>
        </div>
        <div
          onClick={limpiarFiltros}
          className="flex flex-row items-center gap-x-2 p-2 w-1/5 rounded-full justify-center cursor-pointer hover:bg-red-500 transition-all duration-200 group">
          <p className="group-hover:text-white">Limpiar filtros</p>
          <CloseRounded className="group-hover:text-white" fontSize="small" />
        </div>
      </section>
      {trazaTicketFiltrada && trazaTicketFiltrada.ticketsTrazabilidad.length > 0 ? (
        <section className="w-full">
          <StepperTrazaTicket trazaTicket={itemActuales} />
        </section>
      ) : (
        <section className="w-full mt-2">
          <SkeletonComponent />
        </section>
      )}
    </main>
  );
};
