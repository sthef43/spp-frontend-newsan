import { IBaseEntity } from "./IBaseEntity";

export interface IProveedores extends IBaseEntity {
  descripcion?: string | null;
  tipo?: string | null;
  tipoUnidad?: string | null;
  nombreCompleto?: string | null;
}
