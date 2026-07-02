import { ILinea } from "./ILinea";

export interface ICausa {
  idCausa?: number;
  codigoCausa: string;
  descripcion: string;
  puesto: string;
  idLinea?: number;
  linea?: ILinea;
}
