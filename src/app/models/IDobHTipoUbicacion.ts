import { IBaseEntity } from "./IBaseEntity";
import { IDobHUbicacion } from "./IDobHUbicacion";

export interface IDobHTipoUbicacion extends IBaseEntity {
  descripcion?: string | null;
  dobHUbicacion?: Array<IDobHUbicacion> | null;
}
