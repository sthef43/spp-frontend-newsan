import { IBaseEntity } from "./IBaseEntity";
import { IDobHHerramental } from "./IDobHHerramental";
import { IDobHMaquina } from "./IDobHMaquina";

export interface IDobHTipoMaquina extends IBaseEntity {
  codigo?: string | null;
  descripcion?: string | null;
  dobHHerramental?: Array<IDobHHerramental> | null;
  dobHMaquina?: Array<IDobHMaquina> | null;
}