import { IBaseEntity } from "../IBaseEntity";
import { IFamilies } from "./IFamilies";

export interface IProductLines extends IBaseEntity {
  name: string;
  enabled: boolean | null;
  imageRequired?: boolean;
  positionRequired: boolean;
  stationGroupMandatory: boolean;
  families?: IFamilies[];
}
