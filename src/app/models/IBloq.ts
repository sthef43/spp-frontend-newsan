/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { IBaseEntity } from "./IBaseEntity";
import { IAuditBloq } from "./IAuditBloq";
import { IFinalProduct } from "./IFinalProduct";
import { IItemBloq } from "./IItemBloq";
import { IRol } from "./IRol";

export interface IBloq extends IBaseEntity {
  deleted?: boolean | null;
  id?: number;
  name?: string | null;
  image?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  rolId?: number | null;
  rol?: IRol;
  auditBloq?: Array<IAuditBloq> | null;
  finalProduct?: Array<IFinalProduct> | null;
  itemBloq?: Array<IItemBloq> | null;
}
