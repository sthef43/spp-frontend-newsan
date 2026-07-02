import { ILine } from "./ILine";
import { IPeriodo } from "./IPeriodo";

export interface IPeriodoLinea {
  id?: number;
  periodoId: number;
  lineaId: number;
  periodo: IPeriodo;
  linea: ILine;
}
