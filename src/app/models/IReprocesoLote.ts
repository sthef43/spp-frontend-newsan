export interface IReprocesoLote {
  idReproceso?: number | null;
  idControlLote?: number | null;
  numeroOp?: string | null;
  serieDesde?: number | null;
  serieHasta?: number | null;
  idEstadoLote?: number | null;
  observaciones?: string | null;
  cantidadReprocesada?: number | null;
  estadoEbs?: string | null;
  fecha?: Date | null;
  auditor?: string | null;
}
