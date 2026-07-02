/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IAuditBloq } from "./IAuditBloq";
import { IAuditCriterio } from "./IAuditCriterio";
import { IAuditMail } from "./IAuditMail";
import { IAuditType } from "./IAuditType";
import { IRol } from "./IRol";
import { ITodo } from "./ITodo";
import { IBaseEntity } from "./IBaseEntity";
import { IEmailGroup } from "./IEmailGroup";
import { IPlant } from "./IPlant";
export interface IAudit extends IBaseEntity {
  deleted?: boolean | null;
  // id?: number | null;
  // createdDate?: string | null;
  // lastModifiedDate?: string | null;
  name?: string | null;
  numberRegistry?: string | null;
  auditTypeId: number;
  rolId?: number;
  emailGroupId?: number | null;
  groupOfEmails?: string | null;
  plantId: number;
  auditType?: IAuditType | null;
  rol?: IRol | null;
  plant?: IPlant | null;
  auditBloq?: Array<IAuditBloq> | null;
  auditCriterio?: Array<IAuditCriterio> | null;
  auditMail?: Array<IAuditMail> | null;
  todo?: Array<ITodo> | null;
}
// public string Name { get; set; }
// public string NumberRegistry { get; set; }
// public int AuditTypeId { get; set; }
// public int RolId { get; set; }
// public int? EmailGroupId { get; set; }
// public string GroupOfEmails { get; set; }
// public int PlantId { get; set; }
