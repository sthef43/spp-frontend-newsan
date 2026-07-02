import { IBaseEntity } from "./IBaseEntity";
import { IWhatsappMsgOpcionAsignacion } from "./IWhatsappMsgOpcionAsignacion";

export interface IWhatsappMsgAppUser extends IBaseEntity {
  whatsappMsgId: number;
  appUserId: number;
  activo: boolean
  whatsappMsgOpcionAsignacionId: number
  whatsappOpcionAsignacion?: IWhatsappMsgOpcionAsignacion
}
