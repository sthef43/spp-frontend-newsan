import { IBaseEntity } from "./IBaseEntity";
import { IDotaFamilia } from "./IDotaFamilia";
import { ILineaProduccion } from "./ILineaProduccion";

export interface IDotaHistorico extends IBaseEntity {
  dotaFamiliaId: number;
  lineaProduccionId: number;
  sector: string;
  puesto: string;
  activo: boolean;
  cantidad: number;
  numeracion: number;
  dotaFamilia?: IDotaFamilia;
  lineaProduccion?: ILineaProduccion;
}
