import { IBaseEntity } from "app/models";
import { IAuditoriaGrupoItemsBloq } from "./IAuditoriaGrupoItemsBloq";

export interface IAuditoriaGrupoItems extends IBaseEntity {
  nombre: string;
  descripcion?: string;
  urlArchivo?: string;
  auditoriaGrupoItemsBloq?: IAuditoriaGrupoItemsBloq[];
}
