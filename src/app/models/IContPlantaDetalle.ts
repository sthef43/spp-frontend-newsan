import { IBaseEntity } from "./IBaseEntity";
import { IContPedido } from "./IContPedido";

export interface IContPlantaDetalle extends IBaseEntity {
  detalle?: string | null;  
  contPedido?: Array<IContPedido> | null;
}
