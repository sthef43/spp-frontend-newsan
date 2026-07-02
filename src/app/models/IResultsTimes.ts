/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IResult } from './IResult';

export interface IResultsTimes extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    timeLapse?: number;
    resultId?: number;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    result?: IResult;
}