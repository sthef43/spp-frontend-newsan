import { IBaseEntity } from "app/models";
import { IAuditoriaItems } from "./IAuditoriaItems";
import { IAuditoriaGrupoItems } from "./IAuditoriaGrupoItems";

export interface IAuditoriaGrupoItemsBloq extends IBaseEntity {
  auditoriaGrupoItemsId: number;
  auditoriaGrupoItems?: IAuditoriaGrupoItems;
  auditoriaItemsId?: number;
  auditoriaItems?: IAuditoriaItems;
}
