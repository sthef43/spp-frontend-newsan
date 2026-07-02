import { IBaseEntity } from "../../../models/IBaseEntity";
import { IRoutesAyuda } from "./IRoutesAyuda";

export interface IRoutesAyudaPadres extends IBaseEntity {
  padre: string;
  routesAyudas?: IRoutesAyuda[];
}
