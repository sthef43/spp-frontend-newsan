import { IBaseEntity } from "./IBaseEntity";
import { IPlant } from "./IPlant";
import { IWhatsappMsgTiempo } from "./IWhatsappMsgTiempo";

export interface IWhatsappMsgTiempoPlant extends IBaseEntity {
  plantId: number;
  whatsappMsgTiempoId: number;
  plant?: IPlant;
  whatsappMsgTiempo?: IWhatsappMsgTiempo;
}
