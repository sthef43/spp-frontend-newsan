/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { IAuditRegistryResult } from "./IAuditRegistryResult";
import { IBaseEntity } from "./IBaseEntity";
import { IAudit } from "./IAudit";
import { IOperator } from "./IOperator";
import { IPlant } from "./IPlant";
import { ILineaProduccion } from "./ILineaProduccion";
import { ITurno } from "./ITurno";
export interface IAuditRegistry extends IBaseEntity {
  auditId: number;
  operatorId: number;
  plantId?: number | null;
  lineaProduccionId?: number | null;
  lineaProduccion?: ILineaProduccion | null;
  operator?: IOperator | null;
  turno?: ITurno | null;
  turnoId?: number;
  plantaId?: number;
  audit?: IAudit | null;
  codigo?: string | null;
  plant?: IPlant | null;
  auditRegistryResult?: Array<IAuditRegistryResult> | null;
  todoId?: number;
  userNameCanceled?: string;
  canceled?: boolean;
  comentarioBaja?: string
}
