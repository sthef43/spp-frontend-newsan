import { IBaseEntity } from "./IBaseEntity";
import { IDobHHerramental } from "./IDobHHerramental";

export interface IDobHEstado extends IBaseEntity {
  descripcion?: string | null;
  dobHHerramental?: Array<IDobHHerramental> | null;
}
