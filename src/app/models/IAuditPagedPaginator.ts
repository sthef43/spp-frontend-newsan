/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import  { IAudit } from './IAudit';
import { IBaseEntity } from './IBaseEntity';

export interface IAuditPagedPaginator extends IBaseEntity {
    data?: Array<IAudit> | null;
    total?: number;
    totalPage?: number;
    nextPage?: boolean;
    previousPage?: boolean;
}