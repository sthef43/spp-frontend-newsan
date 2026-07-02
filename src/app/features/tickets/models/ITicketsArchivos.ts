import { IBaseEntity } from "app/models"
import { ITickets } from "./ITickets"

export interface ITicketsArchivos extends IBaseEntity {
    urlArchivo: string;
    tipoArchivo: string;
    nombreOriginal: string
    ticketsId: number
    tickets?: ITickets
}