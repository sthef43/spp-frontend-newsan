/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IEngineeringSector } from './IEngineeringSector';
import { IPosition } from './IPosition';

export interface IEngineeringSectorPosition extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    engineeringSectorId?: number;
    positionId?: number;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    engineeringSector?: IEngineeringSector;
    position?: IPosition;
}