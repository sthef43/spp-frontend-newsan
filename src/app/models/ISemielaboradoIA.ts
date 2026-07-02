import { IBaseEntity } from "./IBaseEntity";
import { IFamilia } from "./IFamilia";
import { ISemielaboradoTipo } from "./ISemielaboradoTipo";

export interface ISemielaboradoIA extends IBaseEntity {
  familiaId: number;
  familia?: IFamilia;
  semielaboradoTipoId: number;
  semielaboradoTipo?: ISemielaboradoTipo;
  valor: string;
}
