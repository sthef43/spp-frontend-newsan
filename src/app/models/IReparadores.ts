import { IBaseEntity } from "./IBaseEntity";
import { IPlant } from "./IPlant";
import { IReparadoresLineaProduccion } from "./IReparadoresLineaProduccion";

export interface IReparadores extends IBaseEntity {
  reparador: string;
  codigo: string;
  plant?: IPlant;
  plantId?: number;
  lineas: IReparadoresLineaProduccion[]
}
