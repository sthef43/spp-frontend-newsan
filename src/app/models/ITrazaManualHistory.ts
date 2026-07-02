import { IBaseEntity } from "./IBaseEntity";

export interface ITrazaManualHistory extends IBaseEntity {
  trazabilidad: string;
  trazaManual1?: string | null;
  codigoNewsan: string;
  idLinea: number;
  turno?: string | null;
  finalizado?: boolean;
}
