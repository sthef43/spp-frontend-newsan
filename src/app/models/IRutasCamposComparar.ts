import { IBaseEntity } from "./IBaseEntity";
import { IMapasRutasCampos } from "./IMapasRutasCampos";

export interface IMapasRutasComparar extends IBaseEntity {
  mapasRutasCamposId: number;
  campoCompararId: number;
  tipo: number;
  mapasRutasCampos?: IMapasRutasCampos | null;
  campoComparar?: IMapasRutasCampos | null;
}
