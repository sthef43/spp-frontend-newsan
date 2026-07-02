/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IProduct } from './IProduct';
import { IRol } from './IRol';
import { IStoreroom } from './IStoreroom';
import { IUbicacion } from './IUbicacion';

export interface IEntry extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    productId?: number;
    observation: string;
    quantity?: number;
    storeroomId?: number;
    ubicacionId?: number;
    rolId?: number;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    product?: IProduct;
    rol?: IRol;
    storeroom?: IStoreroom;
    ubicacion?: IUbicacion;
}