import { IBaseEntity } from "./IBaseEntity";

export interface IOQCSeguimiento extends IBaseEntity {
  oqcHallazgoResultId: number;
  oqcHallazgoResult?: any;
  operatorId: number;
  operator?: any;
  causaRaiz: string;
  solucionInmediata: string;
  correccionFinal?: string;
  resuelto: boolean;
}
