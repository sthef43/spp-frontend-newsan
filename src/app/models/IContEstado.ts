import { IBaseEntity } from "./IBaseEntity";
import { IContPedido } from "./IContPedido";

export interface IContEstado extends IBaseEntity {
  detalle?: string | null;
  contPedido?: Array<IContPedido> | null;
}
