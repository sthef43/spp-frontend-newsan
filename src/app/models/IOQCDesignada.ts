import { IBaseEntity } from "./IBaseEntity";
import { IOQC } from "./IOQC";
import { ILineaProduccion } from "./ILineaProduccion";
import { ITurno } from "./ITurno";
import { IOQCDesignadaResultado } from "./IOQCDesignadaResultado";

export interface IOQCDesignada extends IBaseEntity {
  oqcId: number;
  oqc?: IOQC;
  lineaProduccionId: number;
  lineaProduccion?: ILineaProduccion;
  turnoId: number;
  turno?: ITurno;
  cantidad: number;
  celulares: boolean;
  imei2: boolean;
  paletiza: boolean;
  lpn?: boolean | false;
  chkManual?: boolean | false;
  chkFichaTecnica?: boolean | false;
  chkFichaGarantia?: boolean | false;
  chkAccesoGuiado?: boolean | false;
  chkEtiquetaEE?: boolean | false;
  chkEtiquetaCNC?: boolean | false;
  chkEtiquetaEAN?: boolean | false;
  chkFeDeErratas?: boolean | false;
  chkGuiaMagicControl?: boolean | false;
  chkEtiquetaFuenteAlimentacion?: boolean | false;
  chkEtiquetaCableUSB?: boolean | false;
  chkEtiquetaFilmProtector?: boolean | false;
  chkEtiquetaQr?: boolean | false;
  oqcDesignadaResultado?: IOQCDesignadaResultado[];
}
