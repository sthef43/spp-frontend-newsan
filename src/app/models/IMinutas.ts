import { IAppUser } from "./IAppUser";
import { IBaseEntity } from "./IBaseEntity";
import { ILineaProduccion } from "./ILineaProduccion";

export interface IMinutas extends IBaseEntity {
  linea?: ILineaProduccion | null;
  lineaId: number;
  appUser?: IAppUser | null; 
  appUserId: number; 

  tema: string;
  causa: string;
  accion: string; 
  departamento: string;
  cumplido: string; 
  fechaMinuta: string;
  fechaCierre?: string | null;
  semana: number;
}
