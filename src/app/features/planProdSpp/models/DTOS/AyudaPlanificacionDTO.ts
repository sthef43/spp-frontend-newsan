import { IPlanProdSpp } from "../IPlanProdSpp";

export interface AyudaPlanificacion {
    planActual: IPlanProdSpp
    planesAux: PlanSiguienteAndAnterior
}

interface PlanSiguienteAndAnterior {
    planSiguiente: IPlanProdSpp
    planAnterior: IPlanProdSpp
}