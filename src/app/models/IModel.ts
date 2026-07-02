/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import  { IGeneric } from './IGeneric';
import  { IResult } from './IResult';

export interface IModel extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    name: string;
    genericId?: number;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    generic?: IGeneric;
    result?: Array<IResult> | null;
}