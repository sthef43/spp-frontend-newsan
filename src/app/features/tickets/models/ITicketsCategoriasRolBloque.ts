import { IBaseEntity, IRol } from "app/models";
import { ITicketsCategoria } from "./ITicketsCategorias";

export interface ITicketsCategoriasRolBloque extends IBaseEntity {
    ticketsCategoriasId: number
    ticketsCategorias?: ITicketsCategoria
    rolId: number
    rol?: IRol
}