/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IArea } from './IArea';
import { IBaseEntity } from './IBaseEntity';

export interface IAreaPagedPaginator extends IBaseEntity {
    data?: Array<IArea> | null;
    total?: number;
    totalPage?: number;
    nextPage?: boolean;
    previousPage?: boolean;
}