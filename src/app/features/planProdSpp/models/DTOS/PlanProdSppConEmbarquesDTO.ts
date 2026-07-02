import { EmbarqueDTO } from "./EmbarqueDTO";

export interface PlanProdSppConEmbarquesDTO {
    id: number
    planProdId: number
    embarques: EmbarqueDTO[]
}