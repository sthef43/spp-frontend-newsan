import { IBaseEntity, IPlant } from "app/models";
import { ITicketsCategoriasRolBloque } from "./ITicketsCategoriasRolBloque";

export interface ITicketsCategoria extends IBaseEntity {
    nombre: string
    descripcion: string
    plantId?: number
    plant?: IPlant
    ticketsCategoriaRolBloque?: ITicketsCategoriasRolBloque[]
}