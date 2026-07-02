import { ICodigosRechazosValores } from "./ICodigosRechazosValores";
import { IGeneric } from "./IGeneric";

export interface ICodigosDeRechazos extends IGeneric {
  productoId: number;
  codigosDeRechazoValores?: ICodigosRechazosValores[];
  nombre: string;
}
