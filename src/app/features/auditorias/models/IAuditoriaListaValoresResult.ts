import { IBaseEntity } from "app/models";
import { IAuditoriaTipos } from "./IAuditoriaTipos";
import { IAuditoriaValoresResult } from "./IAuditoriaValoresResult";

export interface IAuditoriaListaValoresResult extends IBaseEntity {
  nombre: string;
  auditoriaTiposId: number;
  auditoriaId: number;
  auditoriaTipo?: IAuditoriaTipos;
  auditoriaValoresResult?: IAuditoriaValoresResult[];
}
