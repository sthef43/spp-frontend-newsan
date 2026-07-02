/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { ILineGeneric } from './ILineGeneric';
import { IModel } from './IModel';
import { IResult } from './IResult';

export interface IGeneric extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    name: string;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    lineGeneric?: Array<ILineGeneric> | null;
    model?: Array<IModel> | null;
    result?: Array<IResult> | null;
}