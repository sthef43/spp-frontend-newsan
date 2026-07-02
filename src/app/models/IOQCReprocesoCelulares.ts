import { IBaseEntity } from "./IBaseEntity";
import { ILineaProduccion } from "./ILineaProduccion";
import { IOperator } from "./IOperator";
import { IOQCPalet } from "./IOQCPalet";

export interface IOQCReprocesoCelulares extends IBaseEntity {
  msn: string;
  trackId: string;
  imei1: string;
  imei2?: string;
  lpn: string;
  numeroSerie: string;
  validado: boolean;
  operator?: IOperator | undefined;
  operatorid: number;
  oqcPalet?: IOQCPalet | undefined;
  oqcPaletId: number;
  lineaProduccionId: number;
  lineaProduccion?: ILineaProduccion | undefined;
}
