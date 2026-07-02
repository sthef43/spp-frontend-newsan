import { IBaseEntity } from "./IBaseEntity";
import { TrazaOperaciones } from "./ITrazaOperaciones";

export interface ITrazaUnit2 extends IBaseEntity {
  codigo: string;
  trazaOperacionesId?: number | 0;
  operacion?: TrazaOperaciones | null;
  rechazado?: boolean | false;
  alias?: string | null;
}
