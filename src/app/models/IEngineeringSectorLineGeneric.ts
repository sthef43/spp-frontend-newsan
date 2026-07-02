/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IEngineeringSector } from './IEngineeringSector';
import { ILineGeneric } from './ILineGeneric';

export interface IEngineeringSectorLineGeneric extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    engineeringSectorId?: number;
    lineGenericId?: number;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    engineeringSector?: IEngineeringSector;
    lineGeneric?: ILineGeneric;
}