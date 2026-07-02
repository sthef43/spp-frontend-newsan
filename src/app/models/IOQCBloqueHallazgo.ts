import { IBaseEntity } from "./IBaseEntity";
import { IOQCBloque } from "./IOQCBloque";
import { IOQCHallazgo } from "./IOQCHallazgo";

export interface IOQCBloqueHallazgo extends IBaseEntity {
  oqcBloqueId: number;
  oqcBloque?: IOQCBloque;
  oqcHallazgoId: number;
  oqcHallazgo?: IOQCHallazgo;
  position?: number
}
