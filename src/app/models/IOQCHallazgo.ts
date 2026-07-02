import { IBaseEntity } from "./IBaseEntity";
import { IOQCCategoria } from "./IOQCCategoria";
import { IOQCPonderacion } from "./IOQCPonderacion";
import { IProducto } from "./IProducto";

export interface IOQCHallazgo extends IBaseEntity {
  nombre: string;
  urlImage?: string
  oqcCategoriaId: number;
  oqcCategoria: IOQCCategoria;
  oqcPonderacionId: number;
  oqcPonderacion: IOQCPonderacion;
  productoId: number;
  producto: IProducto;
}
