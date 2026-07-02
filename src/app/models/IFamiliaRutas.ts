import { IBaseEntity } from "./IBaseEntity";
import { IFamilia } from "./IFamilia";
import { IRutas } from "./IRutas";

export interface IFamiliaRutas extends IBaseEntity {
  familiaId?: number;
  familia?: IFamilia;
  rutasId?: number;
  rutas?: IRutas;
  lineaProduccionId: number;
  activa?: boolean;
}
