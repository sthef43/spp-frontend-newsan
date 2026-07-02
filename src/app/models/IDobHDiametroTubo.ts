import { IBaseEntity } from "./IBaseEntity";
import { IDobHHerramental } from "./IDobHHerramental";

export interface IDobHDiametroTubo extends IBaseEntity {
  codigo?: string | null;
  descripcion?: string | null;
  dobHHerramental?: Array<IDobHHerramental> | null;
}
