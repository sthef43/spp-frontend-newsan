/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IAuditType } from './IAuditType';
import { IBaseEntity } from './IBaseEntity';
import { IListaValores } from './IListaValores';

export interface ILista extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    name?: string | null;
    descripcion?: string | null;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    auditType?: Array<IAuditType> | null;
    listaValores?: Array<IListaValores> | null;
}