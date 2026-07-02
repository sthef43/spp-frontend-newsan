import { IBaseEntity } from "app/models";
import { IAuditoriaNivelItem } from "./IAuditoriaNivelItem";
import { IAuditoriaGrupoItemsResult } from "./IAuditoriaGrupoItemsResult";

export interface IAuditoriaItemsResult extends IBaseEntity {
  nombre: string;
  descripcion?: string;
  auditoriaNivelItemId: number;
  itemExistente?: boolean; //Estado para saber si el item existe en la base de datos
  auditoriaNivelItem?: IAuditoriaNivelItem;
  auditoriaGrupoItemsResultId?: number;
  AuditoriaGrupoItemsResult?: IAuditoriaGrupoItemsResult;
}
