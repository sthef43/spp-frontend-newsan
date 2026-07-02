import { IBaseEntity } from ".";
import { IAuditHistorico } from "./IAuditHistorico";

export interface IAuditImagenesHistorico extends IBaseEntity {
  archivo: string
  nombreArchivos: string
  auditHistoricoId: string
  auditHistorico: IAuditHistorico
}