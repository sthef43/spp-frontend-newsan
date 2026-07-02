import { IReprocesoLinea } from "./IReprocesoLinea";

export interface IControlLote {
  idControlLote?: number | null;
  idLinea?: number | null;
  turno?: string | null;
  nombreSupervisor?: string | null;
  codigoModelo?: string | null;
  lote?: string | null;
  cantidadLote?: number | null;
  numeroOp?: string | null;
  cantidadRechazos?: number | null;
  cantidadProducido?: number | null;
  cantidadFaltante?: number | null;
  idEstadoLote?: number | null;
  observaciones?: string | null;
  tipoControl?: string | null;
  serieDesde?: number | null;
  serieHasta?: number | null;
  cantidadReprocesos?: number | null;
  estadoReproceso?: string | null;
  estadoEbs?: string | null;
  estadoColor?: string | null;
  pautas?: string | null;
  direccionPautas?: string | null;
  idPautas?: number | null;
  fecha?: Date | null;
  hora?: Date | null;
  idProveedor?: number | null;
  contenidoDefectuoso?: string | null;
  accioncorrectiva?: string | null;
  planmejora?: string | null;
  oqcDesignadaResultId?: number;
  totalReprocesado?: number;
  fechaReproceso?: Date;
  reprocesoLinea?: IReprocesoLinea[]
}
