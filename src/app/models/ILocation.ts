/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import  { IRol } from './IRol';

export interface ILocation extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    name: string;
    rolId?: number;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    rol?: IRol;
}