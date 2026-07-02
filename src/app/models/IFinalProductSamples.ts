/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IItem } from './IItem';

export interface IFinalProductSamples extends IBaseEntity {
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    deleted?: boolean;
    id?: number;
    sampleId?: number | null;
    itemId?: number | null;
    value?: string | null;
}