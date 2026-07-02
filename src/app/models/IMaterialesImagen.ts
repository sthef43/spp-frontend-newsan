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
export interface IMaterialesImagen extends IBaseEntity {
  url: string;
  codigoWip: string;
}
