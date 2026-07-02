/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { IBaseEntity } from './IBaseEntity';
import { IAudit } from './IAudit';
import { IRol } from './IRol';
import { IValor } from './IValor';

export interface IAuditCriterio extends IBaseEntity {
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