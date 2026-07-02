/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from "./IBaseEntity";
import { ITodo } from "./ITodo";
import { ITurnoExtras } from "./ITurnoExtras";

export interface ITurno extends IBaseEntity {
  nombre?: string | null;
  abreviatura?: string | null;
  desdeHora?: string;
  hastaHora?: string;
  cantidadHoras?: number;
  lastModifiedUserId?: number;
  todo?: Array<ITodo> | null;
  turnoExtras?: ITurnoExtras[];
}
