import { IAreaTraza } from "../IAreaTraza";
import { IParadasDeLinea } from "../IParadasDeLinea";

export interface ParadasPorSectorDTO{
  areaTrazaId?:number,
  areaTraza?:IAreaTraza
  totalMinutos?:number,
  paradas?:IParadasDeLinea[]
}