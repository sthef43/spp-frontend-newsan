import { IAuditComentario } from "./IAuditComentario";
import { IAuditRegistry } from "./IAuditRegistry";
import { IAuditRegistryResult } from "./IAuditRegistryResult";
import { IBaseEntity } from "./IBaseEntity";
import { IRol } from "./IRol";

export interface IAuditTracking extends IBaseEntity {
  rolId: number;
  rol?: IRol;
  auditRegistryResultId: number;
  auditRegistryResult?: IAuditRegistryResult;
  auditRegistryId: number;
  auditRegistry?: IAuditRegistry;
  auditComentario?: IAuditComentario[];
  emailGroup: string;
  tracking: boolean;
  resuelto: boolean;
  creatorUser: string;
  auditOfId: number;
  auditOf?: IRol;
}
