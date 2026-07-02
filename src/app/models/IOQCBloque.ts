import { IBaseEntity } from "./IBaseEntity";
import { IOQCBloqueHallazgo } from "./IOQCBloqueHallazgo";
import { IProducto } from "./IProducto";

export interface IOQCBloque extends IBaseEntity {
  nombre: string;
  productoId: number;
  producto?: IProducto;
  oqcBloqueHallazgo?: IOQCBloqueHallazgo[];
}
