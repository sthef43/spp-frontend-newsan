import { BuildRounded, EditRounded, PersonRounded } from "@mui/icons-material";
import { useAppDispatch } from "app/core/store/store";
import React, { useState } from "react";
import { ITickets } from "../models/ITickets";
import { ticketsItemsProcesosResultadosSlice } from "app/features/tickets/reducers/TicketsItemsProcesosResultadosSlice";
import { ModalCompoment } from "app/shared/components/ui/ModalComponent";
import { EliminarTicketModal } from "../modals/EliminarTicketModal";
import { TrazabilidadTicketModal } from "../modals/TrazabilidadTicketModal";
import { PopperTicket } from "./Componentes Internos/PopperTicket";

interface Props {
  listaTickets: ITickets[];
  openModal?: boolean;
  accionesTickets?: { habilitarEliminar: boolean; verTrazabilidad: boolean };
  activarMostrarDetalles?: boolean;
  mostrarResponsable?: boolean;
  mostrarSiguienteRol?: boolean;
  setFunctionRefresh?: () => void;
  setOpenModal?: (newValue: boolean) => void;
  setTicketSeleccionado?: (newTicket: ITickets) => void;
}

export const ListaTicketsComponent: React.FC<Props> = ({
  listaTickets,
  openModal,
  accionesTickets,
  activarMostrarDetalles,
  mostrarResponsable,
  mostrarSiguienteRol,
  setOpenModal,
  setTicketSeleccionado,
  setFunctionRefresh
}) => {
  const dispatch = useAppDispatch();

  const [openModalEliminar, setOpenModalEliminar] = useState(false);
  const [openModalTrazabilidad, setOpenModalTrazabilidad] = useState(false);

  const [ticketSeleccionadoParaEliminar, setTicketSeleccionadoParaEliminar] = useState<ITickets>();
  const [ticketSeleccionadoParaTrazabilidad, setTicketSeleccionadoParaTrazabilidad] = useState<ITickets>();

  const mostrarDetalles = (nuevoEstado: boolean, idTikcet: number) => {
    const ticketEncontrado = listaTickets.find((elementos) => {
      return elementos.id == idTikcet;
    });
    if (ticketEncontrado.ticketsEstadoId !== 4 && activarMostrarDetalles) {
      dispatch(
        ticketsItemsProcesosResultadosSlice.actions.setLastObjectItem(ticketEncontrado.ticketsItemsProcesosResultado[0])
      );
    } else {
      dispatch(ticketsItemsProcesosResultadosSlice.actions.setLastObjectItem(null));
    }
    setTicketSeleccionado(ticketEncontrado);
    setOpenModal(nuevoEstado);
  };

  const deleteTicketSelected = (ticketSeleccionado: ITickets, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setTicketSeleccionadoParaEliminar(ticketSeleccionado);
    setOpenModalEliminar(true);
  };

  const handleOpenModalTrazabilidad = (ticketSeleccionado: ITickets, event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setTicketSeleccionadoParaTrazabilidad(ticketSeleccionado);
    setOpenModalTrazabilidad(true);
  };

  const buscarFondo = (estadoTicket) => {
    switch (estadoTicket) {
      case "Abierto":
        return <p className="bg-[#c0eeff] text-[#0080af] py-[.5rem] shadow-md px-6 rounded-xl text-sm">Abierto</p>;
      case "En Progreso":
        return <p className="bg-[#ffbd5a] text-[#8d5500] py-[.5rem] shadow-md px-6 rounded-xl text-sm">En progreso</p>;
      case "Cerrado":
        return <p className="bg-[#ce3333] text-[#f8f8f8] rounded-xl py-[.5rem] shadow-md px-6 text-sm">Cerrado</p>;
      case "Solucionado":
        return <p className="bg-[#4bd422d3] text-white rounded-xl py-[.5rem] shadow-md px-6 text-sm">Solucionado</p>;
    }
  };

  // const buscarFondoRol = (nombreRol) => {
  //     switch (nombreRol) {
  //         case "Sistemas Producción":
  //             return (
  //                 <p className="bg-[#c0eeff] text-[#0080af] px-[.4rem] py-[.1rem] rounded-xl text-xs">{nombreRol}</p>
  //             )
  //         case "Ingenieria":
  //             return (
  //                 <p className="px-[.4rem] py-[.1rem] rounded-xl text-xs bg-[#ffbd5a] text-[#8d5500]">{nombreRol}</p>
  //             )
  //         case "Calidad":
  //             return (
  //                 <p className="bg-[#ce3333] text-[#f8f8f8] rounded-xl text-xs px-[.4rem] py-[.1rem]">{nombreRol}</p>
  //             )
  //         default:
  //             return (
  //                 <p className="bg-[#067113] text-[#f8f8f8] rounded-xl text-xs px-[.4rem] py-[.1rem]">{nombreRol}</p>
  //             )
  //     }
  // }

  const fechaFormateada = (fechaTickets: ITickets) => {
    const fechaFormat = new Date(fechaTickets.createdDate);
    if (fechaFormat) {
      return `${fechaFormat.getFullYear()}-${fechaFormat.getMonth() + 1}-${fechaFormat.getDate()}`;
    } else {
      return `Sin Fecha`;
    }
  };

  return (
    <main className="w-full h-full overflow-auto">
      <div className="flex flex-col gap-y-4 justify-center w-full">
        {listaTickets && listaTickets.length > 0 ? (
          listaTickets.map((elementos, index) => (
            <figure
              onClick={() => {
                activarMostrarDetalles ? mostrarDetalles(!openModal, elementos.id) : null;
              }}
              key={index}
              className="flex flex-row justify-between w-full border border-gray-200 rounded-md p-4 shadow-md items-center hover:bg-gray-300/35 transition-colors cursor-pointer [&:has(.no-hover-zone:hover)]:bg-transparent">
              <div className="w-full">
                <div className="flex flex-row items-center w-full justify-between">
                  <h2 className="font-semibold text-xl">
                    [{elementos.sdTicket}] - {elementos.titulo}
                  </h2>
                  {accionesTickets && (
                    <PopperTicket
                      elemento={elementos}
                      accionesTickets={accionesTickets}
                      onDelete={deleteTicketSelected}
                      onTrace={handleOpenModalTrazabilidad}
                    />
                  )}
                </div>
                <div className="flex flex-row items-center mt-6 w-full justify-between">
                  <div className="flex flex-row items-center">
                    <div className="flex flex-row items-center gap-x-2 border-r-2 pr-4 border-gray-300">
                      <PersonRounded fontSize="medium" />
                      <div className="flex flex-col items-start">
                        <p className="font-semibold text-sm">Cliente</p>
                        <p className="text-xs text-gray-500">
                          Cliente: {`${elementos.operator.name} ${elementos.operator.surname}`}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`${
                        mostrarResponsable ? "border-gray-300" : "border-none"
                      } flex flex-row items-center gap-x-2 border-r-2 px-4 `}>
                      <EditRounded fontSize="medium" />
                      <div className="flex flex-col items-start">
                        <p className="font-semibold text-sm">Creado</p>
                        <p className="text-xs text-gray-500">Creado: {fechaFormateada(elementos)}</p>
                      </div>
                    </div>
                    {mostrarResponsable && elementos.responsableOperator && (
                      <div className="flex flex-row items-center gap-x-2 px-4">
                        <BuildRounded fontSize="medium" />
                        <div className="flex flex-col items-start">
                          <p className="font-semibold text-sm">Responsable Actual</p>
                          <p className="text-xs text-gray-500">
                            Responsable Actual:{" "}
                            {`${elementos.responsableOperator.name} ${elementos.responsableOperator.surname}`}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-row items-center">
                    <div className="flex flex-row items-center gap-x-2">
                      {mostrarSiguienteRol && elementos.ticketsItemsProcesosResultado.length > 0 ? (
                        <>
                          <p className="bg-[#c0eeff] text-[#0080af] py-[.5rem] shadow-md px-6 rounded-xl text-sm">
                            {elementos.ticketsItemsProcesosResultado[0].rol.name.trim()}
                          </p>
                        </>
                      ) : (
                        <>
                          {elementos.ticketsEstadoId !== 4 && (
                            <p className="bg-[#0da4309d] text-[#fff] py-[.5rem] shadow-md px-6 rounded-xl text-sm">
                              En espera de cierre
                            </p>
                          )}
                        </>
                      )}
                      {buscarFondo(elementos.ticketsEstado.nombre)}
                      {elementos.ticketsEstadoId !== 4 && <span className="bg-red-500 p-2 rounded-full"></span>}
                    </div>
                  </div>
                </div>
              </div>
            </figure>
          ))
        ) : (
          <p>No se Encontraron Tickets</p>
        )}
      </div>
      <ModalCompoment
        openPopup={openModalEliminar}
        setOpenPopup={setOpenModalEliminar}
        title="Eliminar Ticket"
        showModalCenterPage
        titleModalStyle="New">
        <EliminarTicketModal
          ticketSeleccionado={ticketSeleccionadoParaEliminar}
          funcionDeRefresh={setFunctionRefresh}
          openModal={openModalEliminar}
          setOpenModal={setOpenModalEliminar}
        />
      </ModalCompoment>
      <ModalCompoment
        setOpenPopup={setOpenModalTrazabilidad}
        openPopup={openModalTrazabilidad}
        title="Trazabilidad Ticket"
        showModalCenterPage
        titleModalStyle="New">
        <TrazabilidadTicketModal
          setOpenModal={setOpenModalTrazabilidad}
          openModal={openModalTrazabilidad}
          ticketSeleccionado={ticketSeleccionadoParaTrazabilidad}
        />
      </ModalCompoment>
    </main>
  );
};
