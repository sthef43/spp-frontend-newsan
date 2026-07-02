import { ILinea } from "./ILinea";

export interface IOrigenes {
  idOrigen?: number;
  codigoOrigen: string;
  descripcion: string;
  puesto: string;
  idLinea?: number;
  linea?: ILinea;
}
