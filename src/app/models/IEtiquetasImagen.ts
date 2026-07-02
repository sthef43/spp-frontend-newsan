import { IBaseEntity } from "./IBaseEntity";

export interface IEtiquetasImagen extends IBaseEntity {
  modelo: string;
  tipoDeEtiqueta: string;
  tipoUnidad: string;
  url: string;
  codigoEtiqueta?: string;
}
