/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IOperator } from './IOperator';
import { IProduct } from './IProduct';
import { IRol } from './IRol';
import { IStoreroom } from './IStoreroom';

export interface IExit extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    productId?: number;
    quantity?: number;
    operatorId?: number;
    storeroomId?: number;
    rolId?: number;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    operator?: IOperator;
    product?: IProduct;
    rol?: IRol;
    storeroom?: IStoreroom;
}