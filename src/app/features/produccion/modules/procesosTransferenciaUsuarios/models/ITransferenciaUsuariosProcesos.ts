import { ICLISectores } from "app/features/cli/Models/ICLISectores";
import { IBaseEntity } from "../../../../../models/IBaseEntity";

export interface ITransferenciaUsuariosProcesos extends IBaseEntity {
  nombre: string;
  descripcion: string;
  cliSectoresId: number;
  cliSectores?: ICLISectores;
}
