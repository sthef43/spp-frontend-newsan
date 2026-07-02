/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IEngineeringSectorLineGeneric } from './IEngineeringSectorLineGeneric';
import  { IGeneric } from './IGeneric';
import  { ILine } from './ILine';

export interface ILineGeneric extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    lineId?: number;
    genericId?: number;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    generic?: IGeneric;
    line?: ILine;
    engineeringSectorLineGeneric?: Array<IEngineeringSectorLineGeneric> | null;
}