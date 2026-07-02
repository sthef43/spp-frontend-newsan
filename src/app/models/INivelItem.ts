/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IItem } from './IItem';

export interface INivelItem extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    name: string;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    codigo?: string | null;
    item?: Array<IItem> | null;
}