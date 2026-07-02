import { IBaseEntity } from "app/models";
import { IPlanProdSpp } from "./IPlanProdSpp";
import { IPlanProdSppEmbarque } from "./IPlanProdSppEmbarque";

export interface IPlanProdSppEmbarquesBloque extends IBaseEntity {
    planProdSppId: number
    planProd?: IPlanProdSpp
    planProdSppEmbarqueId: number
    planProdEmbarque?: IPlanProdSppEmbarque[]
}