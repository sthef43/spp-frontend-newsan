/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IAuditCriterio } from './IAuditCriterio';
import { IAuditMail } from './IAuditMail';
import { IBaseEntity } from './IBaseEntity';
import { IFinalProduct } from './IFinalProduct';
import { IListaValores } from './IListaValores';
import { IValorAuditType } from './IValorAuditType';

export interface IValor extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    name?: string | null;
    descripcion?: string | null;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    flagMail?: boolean | null;
    flagCriterio?: boolean | null;
    auditCriterio?: Array<IAuditCriterio> | null;
    auditMail?: Array<IAuditMail> | null;
    finalProduct?: Array<IFinalProduct> | null;
    listaValores?: Array<IListaValores> | null;
    valorAuditType?: Array<IValorAuditType> | null;
}