import { IBaseEntity } from "./IBaseEntity";
import { IDobHHistorial } from "./IDobHHistorial";
import { IDobHTipoUbicacion } from "./IDobHTipoUbicacion";

export interface IDobHUbicacion extends IBaseEntity {
  codigo?: string | null;
  descripcion?: string | null;
  dobHTipoUbicacion?: IDobHTipoUbicacion | null;
  dobHTipoUbicacionId?: number | null;
  dobHHistorial?: Array<IDobHHistorial> | null;
}
