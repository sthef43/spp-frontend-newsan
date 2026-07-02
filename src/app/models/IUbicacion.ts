/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import  { IEntry } from './IEntry';
import  { IRol } from './IRol';

export interface IUbicacion extends IBaseEntity{
    deleted?: boolean | null;
    id?: number;
    name: string;
    rolId?: number;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    rol?: IRol;
    entry?: Array<IEntry> | null;
}