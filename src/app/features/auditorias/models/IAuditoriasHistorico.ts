import { IBaseEntity, IOperator, IPlant, IRol, ISubRol, ITurno } from "app/models";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { IAuditoriaAsignada } from "./IAuditoriaAsignada";
import { IAuditoriaGrupoItemsHistorico } from "./IAuditoriaGrupoItemsHistorico";

export interface IAuditoriasHistorico extends IBaseEntity {
  nombre: string;
  numeroRegistro: string;
  codigoProducto: string;
  operatorId: number;
  comentarioBaja?: string;
  estadoAuditoria: boolean;
  ponderacion: number;
  fechaBaja?: string;
  operator?: IOperator;
  rolId: number;
  rol?: IRol;
  subRolId: number;
  subRol?: ISubRol;
  turnoId: number;
  turno?: ITurno;
  lineaProduccionId: number;
  lineaProduccion?: ILineaProduccion;
  auditoriaAsignadaId: number;
  auditoriaAsignada?: IAuditoriaAsignada;
  plantId: number;
  plant?: IPlant;
  auditoriaGrupoItemsHistorico?: IAuditoriaGrupoItemsHistorico[];
  responsableBajaId?: number;
  operatorBaja?: IOperator;
}
