import { IControlLote } from "./IControlLote";

export interface IReprocesoLinea {
  IdReprocesoLinea: number;
  codigoNewsan?: string | null;
  Fecha?: string | null;
  Hora?: string | null;
  controlLote: IControlLote
  IdControlLote: number;
  NombreUsuario?: string | null;
  estadoReproceso?: string | null;
}
