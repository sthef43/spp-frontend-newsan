import { IProducto } from "./IProducto";
import { IValidarMaterial } from "./IValidarMaterial";
import { IBaseEntity } from "./IBaseEntity";

export interface ITipoMaterial extends IBaseEntity {
  productoId: number;
  producto?: IProducto | null;
  nombre: string;
  validarMaterial?: IValidarMaterial[];
}
