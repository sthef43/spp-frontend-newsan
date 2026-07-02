import { IBaseEntity } from "./IBaseEntity";

export interface IRechazoPuesto extends IBaseEntity {
  nombre: string;
  productoId: number;
  codigoOrigen: string;
  placas: boolean;
}
