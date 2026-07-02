import { IBaseEntity } from "./IBaseEntity";
import { ISemielaboradoTipo } from "./ISemielaboradoTipo";
import { ISemielaboradoModelos } from "./ISemielaboradoModelos";
import { ILinea } from "./ILinea";

export interface ISemielaborado extends IBaseEntity {
  nombre: string;
  lineaId: number;
  linea?: ILinea;
  semielaboradoTipoId: number;
  semielaboradoTipo?: ISemielaboradoTipo;
  semielaboradoModelos?: ISemielaboradoModelos[];
}
