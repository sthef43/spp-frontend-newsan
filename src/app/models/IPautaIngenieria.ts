/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from './IBaseEntity';
import { ILineaProduccionFamilia } from './ILineaProduccionFamilia';
import { IPautaIngenieriaAprobada } from './IPautaIngenieriaAprobada';

export interface IPautaIngenieria extends IBaseEntity {
    referencia?             : string;
    cantidad                : number;
    activado                : boolean;
    fecha                   : Date;
    cantVersionProceso      : number;
    cantGenerico            : number;
    cantPlataforma          : number;
    cantLinea               : number;
    cantPuesto              : number;
    lineaProduccionFamiliaId: number;
    lineaProduccionFamilia? : ILineaProduccionFamilia;
    pautaIngenieriaAprobada?: Array<IPautaIngenieriaAprobada>;
} 