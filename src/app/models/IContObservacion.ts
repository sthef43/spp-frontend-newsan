import { IBaseEntity } from "./IBaseEntity";
import { IContPedido } from "./IContPedido";

export interface IContObservacion extends IBaseEntity {
  observacion?: string | null;
  contPedido?: Array<IContPedido> | null;
}
