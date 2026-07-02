import { IBaseEntity } from "./IBaseEntity";

export interface IWhatsappMsgTiempo extends IBaseEntity {
  hora: string;
  turno: string;
}
