import { IBaseEntity, IPlant } from "app/models";
import { ITicketsCategoria } from "./ITicketsCategorias";
import { ITicketsGrupoProcesosBloque } from "./ITicketsGrupoProcesosBloque";

export interface ITicketsGrupoProcesos extends IBaseEntity {
    nombre: string;
    detalles: string;
    ticketsCategoriasId: number;
    ticketsCategoria?: ITicketsCategoria
    plantId?: number
    plant?: IPlant
    ticketsGrupoProcesosBloques?: ITicketsGrupoProcesosBloque[]
}