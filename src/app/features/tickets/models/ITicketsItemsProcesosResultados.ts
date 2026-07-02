import { IBaseEntity, IOperator, IRol } from "app/models";
import { ITicketsItemsProcesos } from "./ITicketsItemsProcesos";

export interface ITicketsItemsProcesosResultados extends IBaseEntity {
  nombre: string;
  estadoAprobado: boolean;
  aprobacionIntermedia: boolean;
  mensajeAprobacion?: string;
  comentarioAprobado: string;
  ticketsItemsProcesosId: number;
  ticketsId: number;
  operatorId?: number;
  rolId?: number;
  position: number;
  aprobadoCliente?: string;
  ticketsItemsProcesos?: ITicketsItemsProcesos;
  operator?: IOperator;
  rol?: IRol;
}
