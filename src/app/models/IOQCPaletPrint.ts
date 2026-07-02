import { IBaseEntity } from "./IBaseEntity";
import { IOQCPalet } from "./IOQCPalet";
import { IOperator } from "./IOperator";
import { ITurno } from "./ITurno";

export interface IOQCPaletPrint extends IBaseEntity {
  oqcPaletId: number;
  oqcPalet?: IOQCPalet;
  operator?: IOperator;
  operatorCanceled?: IOperator;
  turno?: ITurno;
  operatorCanceledId?: number | null;
  turnoId: number;
  operatorId: number;
  numDesde: number;
  numHasta: number;
  total: number;
  numOp: number;
  observaciones?: string;
  motivoRechazo?: string;
  supervisor: string;
  masterBox: string;
  canceled: boolean;
  ticketConforme: boolean
}
