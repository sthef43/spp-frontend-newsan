import { IBaseEntity } from ".";
import { ILineaProduccion } from "./ILineaProduccion";

export interface IReparadoresLineaProduccion extends IBaseEntity {
    reparadorId?: number;
    lineaProduccionId?: number
    lineaProduccion?: ILineaProduccion
    puesto?:string
}