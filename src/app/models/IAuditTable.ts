/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { IBaseEntity } from './IBaseEntity';

export interface IAuditTable extends IBaseEntity {
    name: string ;
    description?:string | null;
}