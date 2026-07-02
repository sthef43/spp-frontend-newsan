/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IPautaIngenieria } from './IPautaIngenieria';

export interface IPautaIngenieriaAprobada extends IBaseEntity {
    codigo                   : string
    versionProceso           : string;
    generico                 : string;
    plataforma               : string;
    linea                    : string;
    puesto                   : string;
    pautaIngenieriaId        : number;
    activo                   : boolean;
    pautaIngenieria          : IPautaIngenieria;
} 