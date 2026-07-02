import { ILinea } from "./ILinea";

export interface IAjuste {
  id?: number;
  idLinea?: number;
  linea?: ILinea;
  identificador: string;
  ajuste1: number;
}
