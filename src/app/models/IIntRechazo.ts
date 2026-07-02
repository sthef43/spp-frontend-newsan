import { IBaseEntity } from "./IBaseEntity";
import { IIntRemitoPadre } from "./IIntRemitoPadre";

export interface IIntRechazo extends IBaseEntity {
  intRemitoPadreId?: number | null;
  intRemitoPadre?: IIntRemitoPadre | null;
  descripcion?: string | null;
}
