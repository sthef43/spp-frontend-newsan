/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IBloq } from './IBloq';
import { IItem } from './IItem';

export interface IItemBloq extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    bloqId?: number | null;
    itemId?: number | null;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    rolId?: number | null;
    bloq?: IBloq;
    item?: IItem;
}