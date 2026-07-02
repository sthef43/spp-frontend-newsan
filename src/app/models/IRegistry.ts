/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IAudit } from "./IAudit";
import { IBaseEntity } from "./IBaseEntity";
import { IFinalProduct } from "./IFinalProduct";
import { ILine } from "./ILine";
import { IOperator } from "./IOperator";
import { IPlant } from "./IPlant";
import { IRegistryResult } from "./IRegistryResult";
import { IRol } from "./IRol";
import { ISubRol } from "./ISubRol";

export interface IRegistry extends IBaseEntity {
  deleted?: boolean | null;
  id?: number;
  auditId?: number | null;
  operatorId?: number | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  plantId?: number | null;
  lineId?: number | null;
  modelId?: number | null;
  todoCountId?: number | null;
  state?: boolean | null;
  rolId?: number | null;
  subRolId?: number | null;
  turnoId?: number | null;
  line?: ILine;
  operator?: IOperator;
  plant?: IPlant;
  rol?: IRol;
  audit?: IAudit;
  subRol?: ISubRol;
  registryResult?: Array<IRegistryResult> | null;
  finalProduct?: Array<IFinalProduct> | null;
}
