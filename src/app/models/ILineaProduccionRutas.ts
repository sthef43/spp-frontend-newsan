import { IBaseEntity } from "./IBaseEntity";
import { ILineaProduccion } from "./ILineaProduccion";
import { IRutas } from "./IRutas";

export interface ILineaProduccionRutas extends IBaseEntity {
  rutasId?: number;
  rutas?: IRutas;
  lineaProduccionId: number;
  lineaProduccion?: ILineaProduccion[];
  activa?: boolean;
}
