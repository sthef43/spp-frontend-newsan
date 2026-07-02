import { IBaseEntity } from "./IBaseEntity";
import { IFamiliaRutas } from "./IFamiliaRutas";
import { IMapasRutas } from "./IMapasRutas";

export interface IRutas extends IBaseEntity {
  nombre: string;
  descripcion?: string;
  familiaRutas?: IFamiliaRutas[];
  mapasRutas?: IMapasRutas[];
  esUltimo?: boolean;
}
