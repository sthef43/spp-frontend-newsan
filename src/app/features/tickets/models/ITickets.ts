import { IBaseEntity, IOperator, IPlant } from "app/models";
import { ITicketsCategoria } from "./ITicketsCategorias";
import { ITicketsColaboradoresBloque } from "./ITicketsColaboradoresBloque";
import { ITicketsEstados } from "./ITicketsEstado";
import { ITicketsItemsProcesosResultados } from "./ITicketsItemsProcesosResultados";
import { ITicketsTrazabilidad } from "./ITicketsTrazabilidad";

export interface ITickets extends IBaseEntity {
  sla: boolean;
  titulo: string;
  descripcion: string;
  sdTicket?: string;
  motivoEliminacion?: string;
  plantId?: number;
  operatorId: number;
  responsableOperatorId?: number;
  ticketsCategoriaId: number;
  ticketsEstadoId: number;
  plant?: IPlant;
  responsableOperator?: IOperator;
  ticketsCategoria?: ITicketsCategoria;
  operator?: IOperator;
  ticketsEstado?: ITicketsEstados;
  ticketsColaboradoresBloque?: ITicketsColaboradoresBloque[];
  ticketsItemsProcesosResultado?: ITicketsItemsProcesosResultados[];
  ticketsTrazabilidad?: ITicketsTrazabilidad[];
}
