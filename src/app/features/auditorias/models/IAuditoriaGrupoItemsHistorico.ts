import { IBaseEntity } from "app/models";
import { IAuditoriaItemsHistorico } from "./IAuditoriaItemsHistorico";
import { IAuditoriasHistorico } from "./IAuditoriasHistorico";

export interface IAuditoriaGrupoItemsHistorico extends IBaseEntity {
  nombre: string;
  descripcion: string;
  urlArchivo: string | File;
  auditoriasHistoricoId: number;
  auditoriasHistorico?: IAuditoriasHistorico;
  auditoriaItemsHistorico?: IAuditoriaItemsHistorico[];
}
