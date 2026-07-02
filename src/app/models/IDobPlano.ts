import { IBaseEntity } from "./IBaseEntity";
import { IDobSemi } from "./IDobSemi";
import { IDobEstadoPlano } from "./IDobEstadoPlano";
import { IAppUser } from "./IAppUser";
import { IRol } from "./IRol";
import { IDobImpresionesPlanos } from "./IDobImpresionesPlanos";

export interface IDobPlano extends IBaseEntity {
  dobSemi?: IDobSemi;
  dobSemiId?: number;
  dobEstadoPlano?: IDobEstadoPlano;
  appUser?: IAppUser;
  appUserId?: number;
  rol?: IRol;
  rolId?: number;
  imagen?: string | null;
  descripcion?: string | null;
  dibuja?: IAppUser | null;
  dibujaId?: number;
  verifica?: IAppUser | null;
  verificaId?: number;
  aprueba?: IAppUser | null;
  apruebaId?: number;
  tipoHoja?: number;
  //dibujaDate = createdDate
  verificaDate?: string | null;
  apruebaDate?: string | null;
  dobImpresionesPlanos?: Array<IDobImpresionesPlanos> | null;
}
