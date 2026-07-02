/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IProduct } from './IProduct';
import { IRol } from './IRol';

export interface IArea extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    name: string;
    rolId?: number;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    rol?: IRol;
    product?: Array<IProduct> | null;
}