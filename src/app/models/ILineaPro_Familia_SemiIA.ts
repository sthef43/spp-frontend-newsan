import { IBaseEntity } from "./IBaseEntity";

export interface ILineaPro_Familia_SemiIA extends IBaseEntity {
  lineaProduccionFamiliaId: number;
  semielaboradoIAId: number;
  activo: boolean;
}
