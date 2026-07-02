import { IBaseEntity } from "./IBaseEntity";

export interface IWhatsappMsg extends IBaseEntity {
  idLinea: number;
  m: boolean;
  t: boolean;
  n: boolean;
  plantId?: number;
}
