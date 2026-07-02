import { IBaseEntity } from "app/models";
import { IAuditoriaGrupoItemsHistorico } from "./IAuditoriaGrupoItemsHistorico";
import { IAuditoriaNivelItem } from "./IAuditoriaNivelItem";

export interface IAuditoriaItemsHistorico extends IBaseEntity {
  nombre: string;
  descripcion: string;
  valorAsignado: string;
  comentario: string;
  idAgrupadorPorGrupos: number; //Este id lo uso para poder saber a que grupo pertenece y poder agruparlos en el frontend
  auditoriaGrupoItemsHistoricoId?: number;
  auditoriaGrupoItemsHistorico?: IAuditoriaGrupoItemsHistorico;
  auditoriaNivelItemId: number;
  auditoriaNivelItem?: IAuditoriaNivelItem;
}
