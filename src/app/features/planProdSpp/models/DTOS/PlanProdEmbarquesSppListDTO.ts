import { IPlanProdSpp } from "../IPlanProdSpp";
import { IPlanProdSppEmbarque } from "../IPlanProdSppEmbarque";

export interface PlanProdEmbarquesSppListDTO {
    planProdSpp: IPlanProdSpp[]
    planProdSppEmbarques: IPlanProdSppEmbarque[]
}