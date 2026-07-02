import { IBaseEntity } from "./IBaseEntity";

export interface IDobMaestroPieza extends IBaseEntity {
  articulo: string;
  generico: string;
  descripcion: string;
  tipo: string;
  codigoMP: string;
  dimension: string;
  consumo: string;
  proveedor: string;
}
