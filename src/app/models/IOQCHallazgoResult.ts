import { IBaseEntity } from "./IBaseEntity";
import { IOQCDesignadaResultado } from "./IOQCDesignadaResultado";
import { IOQCBloqueHallazgo } from "./IOQCBloqueHallazgo";
import { IOQCSeguimiento } from "./IOQCSeguimiento";

export interface IOQCHallazgoResult extends IBaseEntity {
  oqcDesignadaResultadoId: number;
  oqcDesignadaResultado?: IOQCDesignadaResultado;
  oqcBloqueHallazgoId: number;
  oqcBloqueHallazgo?: IOQCBloqueHallazgo;
  oqcSeguimiento?: IOQCSeguimiento;
  comentario: string;
  state: boolean;
  // Solo para ver el color
  color?: string;
  criticidad?: string;
}
