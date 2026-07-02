/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IEmailGroup } from './IEmailGroup';
import { ILineGeneric } from './ILineGeneric';
import { IPlant } from './IPlant';
import { IRegistry } from './IRegistry';
import { IResult } from './IResult';
import { ITodo } from './ITodo';

export interface ILine extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    name: string;
    plantId?: number;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    plant?: IPlant;
    emailGroup?: Array<IEmailGroup> | null;
    lineGeneric?: Array<ILineGeneric> | null;
    registry?: Array<IRegistry> | null;
    result?: Array<IResult> | null;
    todo?: Array<ITodo> | null;
}