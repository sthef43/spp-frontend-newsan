/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IAudit } from './IAudit';
import { IBaseEntity } from './IBaseEntity';
import { ILista } from './ILista';
import { IRol } from './IRol';
import { IAuditTable } from './IAuditTable';

export interface IAuditType extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    name: string;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    rolId?: number | null;
    sample?: boolean | null;
    listaId?: number | null;
    auditTableId?: number | null;
    lista?: ILista;
    rol?: IRol;
    audit?: Array<IAudit> | null;
    auditTable?: IAuditTable | null;
}