import { IBaseEntity } from "app/models";
import { IPlanProdSpp } from "./IPlanProdSpp";

export interface IPlanProdSppContador extends IBaseEntity {
    programado: number
    producido: number
    planProdSppId: number
    planProdSpp: IPlanProdSpp
} 