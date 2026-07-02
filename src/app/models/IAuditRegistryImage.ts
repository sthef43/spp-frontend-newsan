import { IAuditBloq } from "./IAuditBloq";
import { IAuditRegistry } from "./IAuditRegistry";
import { IBaseEntity } from "./IBaseEntity";

export interface IAuditRegistryImage extends IBaseEntity {
  auditRegistryId: number;
  auditRegistry: IAuditRegistry;
  auditBloqId: number;
  auditBloq: IAuditBloq;
  imageUrl: string;
}
