import { IBaseEntity } from "./IBaseEntity";
import { IDotaFamilia } from "./IDotaFamilia";
import { IDotaSectorPuesto } from "./IDotaSectorPuesto";
import { ILineaProduccion } from "./ILineaProduccion";

export interface IDotaFamiliaLineaProduccion extends IBaseEntity {
  vigente: boolean;
  trabajando?: boolean;
  dotaFamiliaId: number;
  lineaProduccionId: number;
  dotaFamilia?: IDotaFamilia;
  lineaProduccion?: ILineaProduccion;
  dotaSectorPuesto?: IDotaSectorPuesto[];
}
