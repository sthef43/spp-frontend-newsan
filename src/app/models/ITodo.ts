/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IAudit } from "./IAudit";
import { IBaseEntity } from "./IBaseEntity";
import { ILine } from "./ILine";
import { ILineaProduccion } from "./ILineaProduccion";
import { IRol } from "./IRol";
import { ISubRol } from "./ISubRol";
import { ITurno } from "./ITurno";

export interface ITodo extends IBaseEntity {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  deleted?: boolean;
  id?: number;
  auditId?: number | null;
  lineaProduccionId?: number | null;
  cantSample?: number | null;
  rolId?: number | null;
  subRolId?: number | null;
  turnoId?: number | null;
  audit?: IAudit;
  rol?: IRol;
  subRol?: ISubRol;
  turno?: ITurno;
  lineaProduccion?: ILineaProduccion;
}
