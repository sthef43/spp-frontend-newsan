import { IPeriodoHora } from "./IPeriodoHora";

export interface IPeriodo {
  id?: number;
  nombre: string;
  turno: string;
  periodoHora: IPeriodoHora[];
}
