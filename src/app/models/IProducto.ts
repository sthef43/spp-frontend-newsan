import { IBaseEntity } from "./IBaseEntity";

export interface IProducto extends IBaseEntity {
  nombre: string;
  descripcion?: string;
  rolId?: number | null;
}
