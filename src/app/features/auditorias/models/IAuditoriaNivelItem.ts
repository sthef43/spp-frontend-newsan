import { IBaseEntity } from "app/models";

export interface IAuditoriaNivelItem extends IBaseEntity {
  nombre: string;
  codigo: string;
}
