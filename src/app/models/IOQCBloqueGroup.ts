import { IBaseEntity } from "./IBaseEntity";
import { IOQC } from "./IOQC";
import { IOQCBloque } from "./IOQCBloque";

export interface IOQCBloqueGroup extends IBaseEntity {
  oqcId: number;
  oqc?: IOQC;
  oqcBloqueId: number;
  oqcBloque?: IOQCBloque;
  imagenUrl?: string;
}
