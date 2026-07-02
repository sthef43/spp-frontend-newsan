/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { ILista } from './ILista';
import { IValor } from './IValor';

export interface IListaValores extends IBaseEntity {
    deleted?: boolean | null;
    id?: number;
    listaId?: number | null;
    valorId?: number | null;
    createdDate?: string | null;
    lastModifiedDate?: string | null;
    lista?: ILista;
    valor?: IValor;
}