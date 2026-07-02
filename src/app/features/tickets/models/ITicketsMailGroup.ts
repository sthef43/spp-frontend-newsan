import { IBaseEntity, IPermisos } from "app/models";
import { ITicketsCategoria } from "./ITicketsCategorias";

export interface ITicketsMailGroup extends IBaseEntity {
    email: string;
    ticketsCategoriasId: number
    ticketsCategoria?: ITicketsCategoria
    permisosId?: number
    permisos?: IPermisos
}