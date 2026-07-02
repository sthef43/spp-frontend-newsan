export interface IProduccionModelos {
  idModelo?: number;
  codigoModelo?: string;
  descripcion?: string;
  tipoUnidad?: string;
  idTarget?: number | null;
  codigoSgs?: number | null;
  capacidadTipo?: string;
  modeloTps?: number | null;
  temporada?: number | null;
}
