/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IValor } from './IValor';

export interface IValorAuditType extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    valorId?: number | null;
    auditTypeId?: number | null;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    valor?: IValor;
}