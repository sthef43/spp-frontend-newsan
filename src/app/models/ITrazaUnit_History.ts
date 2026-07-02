import { IBaseEntity } from "./IBaseEntity";
import { ILineaPuesto } from "./ILineaPuesto";
import { TrazaOperaciones } from "./ITrazaOperaciones";
import { ITrazaUnit } from "./ITrazaUnit";

export interface TrazaUnit_History extends IBaseEntity {
  codigo: string;
  lineaPuestoId: number;
  lineaPuesto?: ILineaPuesto;
  trazaOperaciones2Id?: number;
  operaciones?: TrazaOperaciones;
  isSemiElaborado: boolean;
  unidad?: ITrazaUnit;
}
