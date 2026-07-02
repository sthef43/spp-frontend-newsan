/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { IBaseEntity } from "./IBaseEntity";
import { IAudit } from "./IAudit";
import { IBloq } from "./IBloq";
import { IRol } from "./IRol";

export interface IAuditBloq extends IBaseEntity {
  id?: number;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  deleted?: boolean | null;
  imagen?: string | 'sinImagen';
  bloqId?: number;
  auditId?: number | null;
  rolId?: number | null;
  audit?: IAudit;
  bloq?: IBloq;
  rol?: IRol;
}
