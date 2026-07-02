import { IBaseEntity } from "./IBaseEntity";
import { IDobHHerramental } from "./IDobHHerramental";

export interface IDobHRadioMedio extends IBaseEntity {
  codigo?: string | null;
  dobHHerramental?: Array<IDobHHerramental> | null;
}
