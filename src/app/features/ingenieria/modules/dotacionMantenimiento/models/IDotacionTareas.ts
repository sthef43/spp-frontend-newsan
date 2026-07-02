import { IBaseEntity } from "app/models";
import { IDotacionSector } from "./IDotacionSector";

export interface IDotacionTareas extends IBaseEntity {
    nombre:string
    detalles: string
    dotacionSectorId: number
    dotacionSector?: IDotacionSector
}