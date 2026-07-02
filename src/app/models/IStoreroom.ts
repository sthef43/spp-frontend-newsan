/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IAppUser } from './IAppUser';
import { IBaseEntity } from './IBaseEntity';
import { IEntry } from './IEntry';
import { IExit } from './IExit';

export interface IStoreroom extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    name?: string | null;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    appUser?: Array<IAppUser> | null;
    entry?: Array<IEntry> | null;
    exit?: Array<IExit> | null;
}