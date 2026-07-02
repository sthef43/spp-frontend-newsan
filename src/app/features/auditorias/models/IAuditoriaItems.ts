import { IBaseEntity } from "app/models";
import { IAuditoriaNivelItem } from "./IAuditoriaNivelItem";

export interface IAuditoriaItems extends IBaseEntity {
  nombre: string;
  descripcion?: string;
  itemExistente?: boolean; //Estado para saber si el item existe en la base de datos
  auditoriaNivelItemId: number;
  auditoriaNivelItem?: IAuditoriaNivelItem;
}
