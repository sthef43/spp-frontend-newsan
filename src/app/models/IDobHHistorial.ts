import { IBaseEntity } from "./IBaseEntity";
import { IAppUser } from "./IAppUser";
import { IDobHUbicacion } from "./IDobHUbicacion";
import { IDobHMaquina } from "./IDobHMaquina";
import { IDobHHerramental } from "./IDobHHerramental";

export interface IDobHHistorial extends IBaseEntity {
  appUser?: IAppUser | null;
  appUserId?: number | null;
  dobHUbicacion?: IDobHUbicacion | null;
  dobHUbicacionId?: number | null;
  dobHMaquina?: IDobHMaquina | null;
  dobHMaquinaId?: number | null;
  dobHHerramental?: IDobHHerramental | null;
  dobHHerramentalId?: number | null;
  diasDeUso?: number | null;  
}
