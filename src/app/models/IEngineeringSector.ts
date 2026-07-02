/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IEngineeringSectorLineGeneric } from './IEngineeringSectorLineGeneric';
import { IEngineeringSectorPosition } from './IEngineeringSectorPosition';
import { IResult } from './IResult';

export interface IEngineeringSector extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    name: string;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    engineeringSectorLineGeneric?: Array<IEngineeringSectorLineGeneric> | null;
    engineeringSectorPosition?: Array<IEngineeringSectorPosition> | null;
    result?: Array<IResult> | null;
}