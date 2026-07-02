import { IBaseEntity, IRol } from "app/models";
import { IAuditoriaValoresListaBloq } from "./IAuditoriaValoresListaBloq";

export interface IAuditoriaTipos extends IBaseEntity {
  nombre: string;
  descripcion: string;
  rolId: number;
  rol?: IRol;
  auditoriaValoresListaBloq?: IAuditoriaValoresListaBloq[];
}
