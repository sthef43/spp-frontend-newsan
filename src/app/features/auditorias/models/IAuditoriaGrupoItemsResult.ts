import { IBaseEntity } from "app/models";
import { IAuditoria } from "./IAuditoria";
import { IAuditoriaItemsResult } from "./IAuditoriaItemsResult";

export interface IAuditoriaGrupoItemsResult extends IBaseEntity {
  nombre: string;
  descripcion?: string;
  urlArchivo?: string;
  auditoriaItemsResult?: IAuditoriaItemsResult[];
  auditoriaId?: number;
  auditoria?: IAuditoria;
}
