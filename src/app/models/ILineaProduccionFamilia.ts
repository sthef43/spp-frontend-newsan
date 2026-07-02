import { IFamilia } from "./IFamilia";
import { IGeneric } from "./IGeneric";
import { ILineaProduccion } from "./ILineaProduccion";
import { IPautaIngenieria } from "./IPautaIngenieria";
import { ISemielaboradoIA } from "./ISemielaboradoIA";

export interface ILineaProduccionFamilia extends IGeneric {
  familiaId: number;
  familia?: IFamilia;
  lineaProduccionId?: number;
  lineaProduccion?: ILineaProduccion;
  pautaIngenieria?: Array<IPautaIngenieria>;
  activa?: boolean;
  semielaboradoIAId: number;
  semielaboradoIA: ISemielaboradoIA;
}
