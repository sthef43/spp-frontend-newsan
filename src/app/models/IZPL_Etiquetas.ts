/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export interface IZPL_Etiquetas {
  id?: number;
  ZPL: string;
  anchoEtiqueta: number;
  altoEtiqueta: number;
  DPmm: number;
  descripcionEtiqueta: string;
  cantidadPosiciones: number;
  activa: boolean;
  prefijo?: string;
  tipEquipo?: string;
  cambiaMes: boolean;
  tipoEtiqueta: number;
}
