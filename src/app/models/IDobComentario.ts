import { IBaseEntity } from "./IBaseEntity";
import { IDobPlano } from "./IDobPlano";
import { IAppUser } from "./IAppUser";

export interface IDobComentario extends IBaseEntity {
  dobPlano: IDobPlano;
  dobPlanoId: number;
  appUser: IAppUser;
  comentario: string;
}
