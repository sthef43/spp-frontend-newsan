import { IBaseEntity } from "./IBaseEntity";
import { IPlant } from "./IPlant";

export interface IExtintorSitio extends IBaseEntity {
  plant?: IPlant | null;
  plantId?: number;
  nombre: string;
}
