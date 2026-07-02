import { IBaseEntity } from "./IBaseEntity";

export interface ITrazaManual extends IBaseEntity {
  trazabilidad: string;
  trazaManual1?: string | null;
  codigoNewsan: string;
  idLinea: number;
  turno?: string | null;
  finalizado?: boolean;
}
