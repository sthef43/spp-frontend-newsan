import { IBaseEntity } from "./IBaseEntity";
import { IProducto } from "./IProducto";
import { IProveedores } from "./IProveedores";

export interface IFamilia extends IBaseEntity {
  familiaId?: number;
  nombre: string;
  semiElaboradoIA:string
  pw?:number
  descripcion: string;
  productoId?: number;
  producto?: IProducto;
  proveedorId?: number
  proveedores?: IProveedores
}
