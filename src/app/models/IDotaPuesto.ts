import { IBaseEntity } from "./IBaseEntity";
import { IDotaSector } from "./IDotaSector";

export interface IDotaPuesto extends IBaseEntity {
  nombre: string;
  dotaSectorId?: number;
  dotaSector?: IDotaSector;
}
