import { IBaseEntity } from "./IBaseEntity";
import { IContPedido } from "./IContPedido";

export interface IContUbicacion extends IBaseEntity {
  detalle?: string | null;
  contPedido?: Array<IContPedido> | null;
}
