import { IImpresionEtiquetasRfid } from "./IImpresionEtiquetasRfid";
import { ITipoEtiqueta } from "./ITipoEtiqueta";

export interface IImpresionEtiqueta {
  idImpresionEtiqueta?: number;
  idLinea: number;
  codigoModelo: string;
  lote: string;
  numeroOp: string;
  cantidadImpresa: number | null;
  idTipoEtiqueta: number | null;
  tipoEtiqueta?: ITipoEtiqueta;
  fechaImpresion: string | null;
  nombreUsuario: string;
  codigoInterno: string;
  estadoEtiqueta: string;
  fechaAprobacion: string | null;
  horaAprobacion: string;
  usuarioAprobacion: string;
  createdDate?: string;
  lastModifiedDate?: string;
  tipoEtiquetaDescripcion?: string;
  tipoEtiquetaCodigo?: string;
  impresionEtiquetaRFID?: IImpresionEtiquetasRfid;
}
