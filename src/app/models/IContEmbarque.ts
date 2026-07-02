import { IBaseEntity } from "./IBaseEntity";
import { IContContenedor } from "./IContContenedor";
import { IContPlanProduccion } from "./IContPlanProduccion";

export interface IContEmbarque extends IBaseEntity {
  contPlanProduccion?: IContPlanProduccion;
  contPlanProduccionId?: number;
  detalle?: string | null;
  numero?: string | null;
  contContenedor?: Array<IContContenedor> | null;
}

