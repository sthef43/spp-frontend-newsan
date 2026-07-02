import { IAuditTable } from "./IAuditTable";
import { IBaseEntity } from "./IBaseEntity";
import { IPlant } from "./IPlant";
export interface IAuditDispositivo extends IBaseEntity {
  auditTableId: number;
  plantaId: number;
  nombre?: string | null;
  marca?: string | null;
  modelo?: string | null;
  ano?: string | null;
  interno?: string | null;
  codigo: string;
  auditTable?: IAuditTable | null;
  planta?: IPlant | null;
}
