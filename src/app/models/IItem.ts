/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IFinalProduct } from './IFinalProduct';
import { IFinalProductSamples } from './IFinalProductSamples';
import { IItemBloq } from './IItemBloq';
import { INivelItem } from './INivelItem';
import { IRol } from './IRol';

export interface IItem extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    name?: string | null;
    nivelItemId?: number;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    rolId?: number | null;
    nivelItem?: INivelItem;
    rol?: IRol;
    finalProduct?: Array<IFinalProduct> | null;
    itemBloq?: Array<IItemBloq> | null;
}