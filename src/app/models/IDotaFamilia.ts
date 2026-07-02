import { IBaseEntity } from "./IBaseEntity";
import { ILineaProduccion } from "./ILineaProduccion";

export interface IDotaFamilia extends IBaseEntity {
  nombre: string;
  lineaProduccionId?: number;
  lineaProduccion?: ILineaProduccion;
}
