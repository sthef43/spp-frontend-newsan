import { IBaseEntity } from "./IBaseEntity";
import { TrazaOperaciones } from "./ITrazaOperaciones";

export interface ITrazaUnit extends IBaseEntity {
  codigo: string;
  trazaOperacionesId?: number;
  operacion?: TrazaOperaciones;
  rechazado?: boolean;
  alias: string;
}
