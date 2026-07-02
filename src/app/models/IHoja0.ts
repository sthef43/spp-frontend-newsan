/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { IPautaIngenieriaAprobada } from './IPautaIngenieriaAprobada';

export interface IHoja0 extends IBaseEntity {
    codigo: string;
    descripcion: string;
    pautaIngenieriaAprobadaId: number;
    PautaIgenieriaAprobada: IPautaIngenieriaAprobada
}