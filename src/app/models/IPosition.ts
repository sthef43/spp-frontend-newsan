/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IEngineeringSectorPosition } from './IEngineeringSectorPosition';
import { IResult } from './IResult';

export interface IPosition extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    name: string;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    engineeringSectorPosition?: Array<IEngineeringSectorPosition> | null;
    result?: Array<IResult> | null;
}