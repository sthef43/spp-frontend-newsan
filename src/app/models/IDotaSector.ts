import { IBaseEntity } from "./IBaseEntity";
import { IDotaSectorPuesto } from "./IDotaSectorPuesto";
import { IPlant } from "./IPlant";

export interface IDotaSector extends IBaseEntity {
  nombre: string;
  plantId: number;
  plant?: IPlant;
  dotaSectorPuesto?: IDotaSectorPuesto[];
}
