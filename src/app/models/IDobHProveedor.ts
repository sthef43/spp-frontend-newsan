import { IBaseEntity } from "./IBaseEntity";
import { IDobHHerramental } from "./IDobHHerramental";

export interface IDobHProveedor extends IBaseEntity {
  nombre?: string | null;
  nacionalidad?: string | null;
  dobHHerramental?: Array<IDobHHerramental> | null;
}
