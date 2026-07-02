import { IBaseEntity } from "./IBaseEntity";
import { ILineaProduccion } from "./ILineaProduccion";
import { IProducto } from "./IProducto";

export interface IOQCTarget extends IBaseEntity {
  productoId: number;
  lineaProduccionId: number;
  producto: IProducto;
  lineaProduccion?: ILineaProduccion;
  target: number;
}
