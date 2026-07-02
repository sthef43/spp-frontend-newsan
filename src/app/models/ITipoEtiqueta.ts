export interface ITipoEtiqueta {
  idTipoEtiqueta: number;
  descripcion: string;
  posiciones: number | null;
  toleranciaEtiquetas: number | null;
  nombreImpresora: string;
  nombrePlantilla: string;
  idLinea: number | null;
  codigo: string;
}
