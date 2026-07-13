import { ITrazaProductoPuesto } from ".";
import { IBaseEntity } from "./IBaseEntity";

export interface IPuesto extends IBaseEntity {
  id?: number;
  deleted?: boolean;
  nombre: string;
  descripcion?: string;
  trazaProductoPuesto?: ITrazaProductoPuesto[];
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  plantId?: number;
  tipo?: string | null;
}
