import { IBaseEntity, IOperator } from "app/models";
import { ITickets } from "./ITickets";

export interface ITicketsColaboradoresBloque extends IBaseEntity {
    ticketsId: number
    ticket?: ITickets
    colaboradoresId: number
    colaboradores?: IOperator
}