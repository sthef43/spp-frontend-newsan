/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IEngineeringSector } from './IEngineeringSector';
import { IGeneric } from './IGeneric';
import { ILine } from './ILine';
import { IModel } from './IModel';
import { IPlant } from './IPlant';
import { IPosition } from './IPosition';
import { IResultsTimes } from './IResultsTimes';

export interface IResult extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    plantId?: number;
    lineId?: number;
    genericId?: number;
    modelId?: number;
    engineeringSectorId?: number;
    positionId?: number;
    resultTime?: number;
    finalTime?: number;
    totalLapses?: number;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    engineeringSector?: IEngineeringSector;
    generic?: IGeneric;
    line?: ILine;
    model?: IModel;
    plant?: IPlant;
    position?: IPosition;
    resultsTimes?: Array<IResultsTimes> | null;
}