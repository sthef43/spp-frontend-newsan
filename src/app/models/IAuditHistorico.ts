import { IBaseEntity, IOperator, IPlant, IRol } from ".";
import { ILineaProduccion } from "./ILineaProduccion";

export interface IAuditHistorico extends IBaseEntity {
  nombre: string;
  numeroRegistro: string;
  nombreTipoAuditoria: string;
  tipoMuestra: string;
  codigo: string;
  indiceAprobacion: number
  lineaProduccionId?: number;
  lineaProduccion?: ILineaProduccion;
  operatorId: number;
  operator?: IOperator;
  rolId: number;
  rol?: IRol;
  plantId: number;
  plant?: IPlant;
}
