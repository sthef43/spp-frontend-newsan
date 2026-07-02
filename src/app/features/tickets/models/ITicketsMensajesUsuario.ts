import { IBaseEntity, IOperator } from "app/models";
import { ITickets } from "./ITickets";

export interface ITicketsMensajesUsuario extends IBaseEntity {
    mensaje?: string
    archivo?: string
    tipoArchivo?: string
    operatorId: number
    operator?: IOperator
    ticketsId: number
    tickets?: ITickets
}