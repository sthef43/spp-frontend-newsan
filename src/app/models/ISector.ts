/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IProduct } from './IProduct';

export interface ISector extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    name: string;
    rolId?: number;
    areaId?: number;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    product?: Array<IProduct> | null;
}