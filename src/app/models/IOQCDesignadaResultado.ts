import { IBaseEntity } from "./IBaseEntity";
import { IOQCDesignada } from "./IOQCDesignada";
import { IOQCDesignadaResultadoImagen } from "./IOQCDesignadaResultadoImagen";
import { IOQCHallazgoResult } from "./IOQCHallazgoResult";
import { IOQCPalet } from "./IOQCPalet";
import { IOQCSeguimiento } from "./IOQCSeguimiento";
import { IOperator } from "./IOperator";

//Apartir de el IMEI 2, los restantnes imeis se usan de forma que cuando exporte el csv se adapte y que si encuentra un imei se agregue
export interface IOQCDesignadaResultado extends IBaseEntity {
  codigoModelo: string;
  observacion?: string;
  numeroSerie: string;
  imei?: string;
  imei2?: string;
  imei3?: string;
  imei4?: string;
  imei5?: string;
  imei6?: string;
  imei7?: string;
  imei8?: string;
  imei9?: string;
  imei10?: string;
  cajaMaster?: string;
  msn?: string;
  eanCode?: string;
  trackId?: string;
  validate?: boolean;
  canceled?: boolean;
  canceledComentario?: string | null;
  operatorId: number;
  operator?: IOperator;
  operatorCanceledId?: number;
  operatorCanceled?: IOperator;
  oqcDesignadaId: number;
  numeroOP?: string;
  indicePonderacion: number;
  oqcDesignada?: IOQCDesignada;
  oqcHallazgoResult?: IOQCHallazgoResult[];
  oqcDesignadaResultadoImagen?: IOQCDesignadaResultadoImagen[];
  oqcSeguimiento?: IOQCSeguimiento;
  oqcPaletId?: number;
  oqcPalet?: IOQCPalet;
  cantidadHallazgos?: number
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  deleted?: boolean | null;
}
