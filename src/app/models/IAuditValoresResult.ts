import { IBaseEntity } from ".";
import { IAuditHistorico } from "./IAuditHistorico";

export interface IAuditValoresResult extends IBaseEntity {
  nombreValor: string;
  descripcion: string;
  nombreLista: string;
  descripcionLista: string
  nombreItem: string;
  comentario: string;
  nombreBloque: string;
  numeroBloque: number;
  nivelItemNombre: string;
  nivelItemCodigo: string;
  flagCriterio: boolean;
  flagEmail: boolean;
  auditHistoricoId: number
  auditHistorico?: IAuditHistorico
}
