import { IBaseEntity } from "./IBaseEntity";
import { ILineaPuesto } from "./ILineaPuesto";


export interface ITrazaUnit_History2 extends IBaseEntity {
  codigo: string;
  lineaPuestoId: number;
  isSemiElaborado: boolean;
  lineaPuesto?: ILineaPuesto;
  trazaOperaciones2Id?: number;
}
