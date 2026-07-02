export interface IEstadoDeRenderizado {
  cantidadBloques: number;
  bloqueSeleccionado: Record<number, string | number>;
  edicionActiva: boolean;
  estadoModalNuevoTipo: boolean;
  mostrarListaValores: boolean;
}
