import { IBaseEntity } from "./IBaseEntity";
import { IIntRemito } from "./IIntRemito";

export interface IIntDetalle extends IBaseEntity {
  intRemitoId?: number | 0;
  intRemito?: IIntRemito | null;
  codigo?: string | null;
  descripcion?: string | null;
  cantidad?: number | 0;
  cajas?: string | null;
  anexo?: string | null;
  cont?: number | 0;
  numero?: number | 0;
}
