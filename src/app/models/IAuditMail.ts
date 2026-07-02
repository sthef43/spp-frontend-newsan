/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import  { IAudit } from './IAudit';
import { IBaseEntity } from './IBaseEntity';
import  { IRol } from './IRol';
import  { IValor } from './IValor';

export interface IAuditMail extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    auditId?: number | null;
    valorId?: number | null;
    rolId?: number | null;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    audit?: IAudit;
    rol?: IRol;
    valor?: IValor;
}