import { IBaseEntity } from "./IBaseEntity";

export interface ICalidadInspeccionesRechazo extends IBaseEntity {
  componente?: string | null;
  subComponente?: string | null;
  defecto?: string | null;
  idRechazo?: number | null;
  // calidadInspeccionesId?: number | null;
  calidadInspecciones?: [] | null;
  estado?: boolean | null;
  idReparacion?: number | null;
}
