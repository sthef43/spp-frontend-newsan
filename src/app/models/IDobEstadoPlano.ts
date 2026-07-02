import { IBaseEntity } from "./IBaseEntity";
import { IDobPlano } from "./IDobPlano";

export interface IDobEstadoPlano extends IBaseEntity {
  descripcion?: string | null;
  dobPlano?: Array<IDobPlano> | null;
}
