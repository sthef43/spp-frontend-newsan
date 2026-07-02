import { IBaseEntity } from "app/models";
import { IDotacionSector } from "./IDotacionSector";

export interface IDotacionTareasResultados extends IBaseEntity {
    nombreTarea: string
    valorTarea: number
    dotacionSectoresId: number
    lineaTurnoField?: string
    sector?: IDotacionSector
    dotacionId: number
}