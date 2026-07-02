import { IBaseEntity } from "./IBaseEntity";
import { IDobHHistorial } from "./IDobHHistorial";
import { IDobHTipoMaquina } from "./IDobHTipoMaquina";

export interface IDobHMaquina extends IBaseEntity {
  numero?: number | null;
  descripcion?: string | null;
  dobHTipoMaquina?: IDobHTipoMaquina | null;
  dobHTipoMaquinaId?: number;
  dobHHistorial?: Array<IDobHHistorial> | null;
}
