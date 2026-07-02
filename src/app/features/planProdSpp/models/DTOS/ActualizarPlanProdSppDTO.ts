import { IPlanProdSpp } from "../IPlanProdSpp";

export interface ActualizarPlanProdSppDTO {
    mesDesde: string
    mesHasta: string
    entidad: IPlanProdSpp
}