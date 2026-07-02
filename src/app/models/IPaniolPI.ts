import { IBaseEntity } from "./IBaseEntity";
import { IPlant } from "./IPlant";

export interface IPaniolPI extends IBaseEntity {
  plantId: number;
  plant?: IPlant;
  articulo: string;
  marca: string;
  modelo: string;
  detalles: string;
  cantidad: number;
  movimiento: string;
  conMovimiento: boolean;
  useDni: number;
  userName: string;
}
