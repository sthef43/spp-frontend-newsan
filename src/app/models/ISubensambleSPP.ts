import { IGeneric } from "./IGeneric";
import { ILineaProduccion } from "./ILineaProduccion";
import { IMapasRutas } from "./IMapasRutas";
import { IRutas } from "./IRutas";
import { IPuesto } from ".";

export interface ISubensambleSPP extends IGeneric {
  MapasRutasId: number;
  MapasRutas: IMapasRutas;
  MapasRutasCamposId: number;
  PuestoId: number;
  puesto?: IPuesto;
  lineaProduccionId?: number;
  lineaProduccion?: ILineaProduccion[];
  RutasId: number;
  rutas: IRutas;
}
