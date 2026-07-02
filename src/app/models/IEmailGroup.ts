/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IAudit } from "./IAudit";
import { IBaseEntity } from "./IBaseEntity";
import { ILine } from "./ILine";
import { IPlant } from "./IPlant";
import { IRol } from "./IRol";

export interface IEmailGroup extends IBaseEntity {
  deleted?: boolean | null;
  id?: number;
  name?: string | null;
  emails?: string | null;
  rolId?: number | null; //5
  rol?: IRol;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  plantId?: number | null; //Seleccion
  plant?: IPlant;
  lineId?: number | null; //null
  line?: ILine;
  auditId?: number | null; //null
}
