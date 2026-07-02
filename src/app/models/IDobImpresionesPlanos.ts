import { IBaseEntity } from "./IBaseEntity";
import { IDobPlano } from "./IDobPlano";
import { IAppUser } from "./IAppUser";

export interface IDobImpresionesPlanos extends IBaseEntity {
  dobPlano?: IDobPlano;
  appUserCrea?: IAppUser;
  appUser?: IAppUser;
  estado?: string;
  dobPlanoId: number;
  appUserCreaId: number;
  appUserId: number;
}
