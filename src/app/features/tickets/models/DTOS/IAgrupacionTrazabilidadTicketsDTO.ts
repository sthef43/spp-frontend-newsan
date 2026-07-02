import { ITicketsTrazabilidad } from "../ITicketsTrazabilidad";
import { IOperator } from "app/models";

export interface IAgrupacionTrazabilidadTicketsDTO {
  ticketsTrazabilidad: ITicketsTrazabilidad[];
  listaPosiciones: string[];
  operatorsId: number[];
  operators: IOperator[];
}
