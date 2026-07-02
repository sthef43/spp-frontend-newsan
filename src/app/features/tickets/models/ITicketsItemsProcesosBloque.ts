import { IBaseEntity } from "app/models";
import { ITicketsItemsProcesos } from "./ITicketsItemsProcesos";

export interface ITicketsItemsProcesosBloque extends IBaseEntity {
    ticketsItemsProcesosId: number
    ticketsItemsProcesos?: ITicketsItemsProcesos
    ticketsItemsProcesosBajaId: number
    ticketsItemsProcesosBaja?: ITicketsItemsProcesos
}