import { IBaseEntity } from "app/models";
import { IOrganizacion } from "app/models/IOrganizacion";
import { ICLIEstado } from "./ICLIEstado";

export interface ICLIUbicaciones extends IBaseEntity {
  localizador: string;
  pasillo: string;
  organizacionId: number;
  organizacion?: IOrganizacion | null;
  cliEstadoId: number;
  cliEstado?: ICLIEstado | null;
  cliTipoUBCId: number;
  cliTipoUBC?: ICLIEstado | null;
}
