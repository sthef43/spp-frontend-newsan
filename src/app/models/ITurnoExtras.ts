import { IBaseEntity } from "./IBaseEntity";
import { ITurno } from "./ITurno";

export interface ITurnoExtras extends IBaseEntity {
  turnoId: number;
  turno: ITurno;
  desdeHora: string;
  hastaHora: string;
}
