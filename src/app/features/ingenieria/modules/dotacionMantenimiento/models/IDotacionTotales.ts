import { IBaseEntity } from "app/models";
import { IDotacion } from "./IDotacion";

export interface IDotacionTotales extends IBaseEntity {
    piso: string
    turno: string
    lrUiMañana?: number
    lrUeFlexMañana?: number
    lrUiTarde?: number
    lrUeFlexTarde?: number
    hrUiMañana?: number
    hrUeMañana?: number
    hrUiTarde?: number
    hrUeTarde?: number
    dotacionId: number
    dotacion?: IDotacion
}