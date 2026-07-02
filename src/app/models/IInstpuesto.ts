import { IBaseEntity } from "./IBaseEntity";

export interface IInstpuesto extends IBaseEntity {
  productoId: number;
  codigoPuesto?: string | null;
  descripcion?: string | null;
  sector?: string | null;
  tipo?: string | null;
  critico: boolean;
}
