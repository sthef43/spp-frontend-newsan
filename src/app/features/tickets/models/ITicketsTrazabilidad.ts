import { IBaseEntity, IOperator } from "app/models";
import { ITickets } from "./ITickets";

export interface ITicketsTrazabilidad extends IBaseEntity {
  accion: string;
  mensajeAccion: string;
  operatorId: number;
  ticketsId: number;
  operator?: IOperator;
  tickets?: ITickets;
}
