import { IBaseEntity } from "./IBaseEntity";
import { IHoraExtraTurnoExtras } from "./IHoraExtraTurnoExtras";
import { IProducto } from "./IProducto";

export interface IHoraExtra extends IBaseEntity {
  productoId: number;
  producto?: IProducto;
  horaExtraTurnoExtras?: IHoraExtraTurnoExtras[];
  emailGroup: string;
  observacion: string | null;
  userName: string;
}
