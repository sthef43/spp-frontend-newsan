import { IBaseEntity } from "./IBaseEntity";
import { IAppUser } from "./IAppUser";
import { IHojaParametro } from "./IHojaParametro";

export interface IHojaPComentario extends IBaseEntity {
  hojaParametro: IHojaParametro;
  hojaParametroId: number;
  appUser: IAppUser;
  appUserId: number;
  comentario: string;
}
