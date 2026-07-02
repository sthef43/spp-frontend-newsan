import { IBaseEntity } from "./IBaseEntity";
import { IDotaPuesto } from "./IDotaPuesto";
import { IDotaSector } from "./IDotaSector";

export interface IDotaSectorPuesto extends IBaseEntity {
  cantidad: number;
  dotaSectorId: number;
  dotaPuestoId?: number;
  dotaFamiliaLineaProduccionId?: number;
  dotaSector?: IDotaSector;
  dotaPuesto?: IDotaPuesto;
}
