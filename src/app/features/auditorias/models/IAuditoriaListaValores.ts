import { IBaseEntity } from "app/models";
import { IAuditoriaValoresListaBloq } from "./IAuditoriaValoresListaBloq";
import { IAuditoriaTipos } from "./IAuditoriaTipos";

export interface IAuditoriaListaValores extends IBaseEntity {
  nombre: string;
  descripcion?: string;
  auditoriaTiposId?: number;
  auditoriaTipos?: IAuditoriaTipos;
  auditoriaValoresListaBloq?: IAuditoriaValoresListaBloq[];
}
