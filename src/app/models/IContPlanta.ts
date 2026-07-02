import { IBaseEntity } from "./IBaseEntity";
import { IContConfigImpoExcel } from "./IContConfigImpoExcel";
import { IContPlanProduccion } from "./IContPlanProduccion";

export interface IContPlanta extends IBaseEntity {
  nombre?: string | null;  
  contPlanProduccion?: Array<IContPlanProduccion> | null;
  contConfigImpoExcel?: Array<IContConfigImpoExcel> | null;
}
