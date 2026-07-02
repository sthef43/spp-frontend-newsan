import { IBaseEntity } from "./IBaseEntity";
import { IIntRemitoPadre } from "./IIntRemitoPadre";
import { IPlant } from "./IPlant";

export interface IIntDarsena extends IBaseEntity {
  plantId?: number | null;
  plant?: IPlant | null;
  intRemitoPadreId?: number | null;
  intRemitoPadre?: IIntRemitoPadre | null;
  detalle?: string | null;
  estado?: boolean | null; //Libre o Ocupada
}
