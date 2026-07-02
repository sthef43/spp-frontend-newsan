import { IGeneric } from "./IGeneric";
import { IPuestosParametro } from "./IPuestosParametro";


export interface ICodigosRechazosValores extends IGeneric {
  codigosDeRechazosId: number;
  codigo: string;
  descripcion: string;
  puestoParametroId?: number;
  puestoParametro?: IPuestosParametro;
  productoId?: number;
}
