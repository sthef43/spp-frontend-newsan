import { IPlanProd } from "./IPlanProd";

export interface IProduccionInicio {
  idInicio: number;
  fecha: string;
  turno: string;
  idProduccion: number;
  tipoUnidad: string;
  codigoTrazabilidad: string;
  codigoNewsan: string;
  fechaFin: string | null;
  nombreInicio: string;
  nombreFin: string;
  turnoFin: string;
  hora: string | null;
  horaFin: string | null;
  observaciones: string;
  compresor: string;
  codigoNewsan2: string;
  idModelo: number | null;
  montado: number | null;
  fechaMontado: string | null;
  horaMontado: string | null;
  modeloFin: string;
  nroOp: string;
  organizacion: string;
  lote: string;
  target: number | null;
  nroLpn: string;
  codigoEvaporador: string;
  idProveedor: number | null;
  idProduccionNavigation: IPlanProd;
}
