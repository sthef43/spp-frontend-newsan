/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { IBaseEntity } from './IBaseEntity';
import { IArea } from './IArea';
import { IEntry } from './IEntry';
import { IExit } from './IExit';
import { IRol } from './IRol';
import { ISector } from './ISector';
import { IUnitMeasurement } from './IUnitMeasurement';

export interface IProduct extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    code: string;
    name: string;
    description?: string | null;
    securityStock?: number;
    replacementType: string;
    areaId?: number;
    sectorId?: number;
    unitMeasurementId?: number;
    rolId?: number;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    area?: IArea;
    rol?: IRol;
    sector?: ISector;
    unitMeasurement?: IUnitMeasurement;
    entry?: Array<IEntry> | null;
    exit?: Array<IExit> | null;
}