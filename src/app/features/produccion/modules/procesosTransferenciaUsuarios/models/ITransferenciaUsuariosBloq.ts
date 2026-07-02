import { IBaseEntity } from "app/models";
import { ICLISectores } from "app/features/cli/Models/ICLISectores";
import { ITransferenciaUsuariosPermitidos } from "./ITransferenciaUsuariosPermitidos";
import { ITransferenciaUsuariosProcesos } from "./ITransferenciaUsuariosProcesos";

export interface ITransferenciaUsuariosBloq extends IBaseEntity {
  transferenciaUsuariosPermitidosId: number;
  transferenciaUsuariosPermitidos?: ITransferenciaUsuariosPermitidos;
  transferenciaUsuariosProcesosId: number;
  transferenciaUsuariosProcesos?: ITransferenciaUsuariosProcesos;
  cliSectoresId: number;
  cliSectores?: ICLISectores;
}
