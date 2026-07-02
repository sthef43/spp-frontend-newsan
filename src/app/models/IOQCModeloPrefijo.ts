import { IBaseEntity } from "./IBaseEntity";

export interface IOQCModeloPrefijo extends IBaseEntity {
  etiquetaFilmProtector: string;
  prefijo: string;
  modelo: string;
  manual: string;
  fichaTecnica: string;
  fichaGarantia: string;
  accesoGuiado: string;
  etiquetaEE: string;
  etiquetaCNC: string;
  etiquetaEAN: string;
  feDeErratas: string;
  guiaMagicControl: string;
  etiquetaFuenteAlimentacion: string;
  etiquetaCableUSB: string;
  etiquetaQr: string;
}
