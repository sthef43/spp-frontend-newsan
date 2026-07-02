import { IBaseEntity } from "./IBaseEntity";
import { IFamilia } from "./IFamilia";
import { ITipoMaterial } from "./ITipoMaterial";

export interface IValidarMaterial extends IBaseEntity {
  tipoMaterialId: number;
  tipoMaterial?: ITipoMaterial;
  familiaId: number;
  familia?: IFamilia | null;
  prefijo: string;
}
