import { IBaseEntity } from "./IBaseEntity";
import { IModelos } from "./IModelos";
import { ISemielaborado } from "./ISemielaborado";

export interface ISemielaboradoModelos extends IBaseEntity {
  semielaboradoId: number;
  semielaborado?: ISemielaborado;
  modelosId: number;
  modelos?: IModelos;
}
