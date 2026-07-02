/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { IAuditRegistry } from "./IAuditRegistry";
import { IAuditTracking } from "./IAuditTracking";
import { IBaseEntity } from "./IBaseEntity";
import { IItemBloq } from "./IItemBloq";

export interface IAuditRegistryResult extends IBaseEntity {
  valorId: number;
  comentario?: string | null;
  itemBloqId?: number;
  itemBloq?: IItemBloq | null;
  auditRegistryId?: number | null;
  auditRegistry?: IAuditRegistry[];
  auditTracking?: IAuditTracking;
  resuelto?: boolean;
  tracking?: boolean;
}
