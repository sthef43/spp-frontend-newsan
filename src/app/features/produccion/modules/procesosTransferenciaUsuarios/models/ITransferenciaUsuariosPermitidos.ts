import { IBaseEntity } from "../../../../../models";

export interface ITransferenciaUsuariosPermitidos extends IBaseEntity {
  nombre?: string;
  apellido?: string;
  dni: string;
}
