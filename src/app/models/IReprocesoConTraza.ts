import { IControlLote } from "./IControlLote";

export interface IReprocesoLineaConTraza
{
  IdReprocesoLineasc: number;
  IdReprocesoLinea: number;
  codigoNewsan?: string | null;
  Fecha?: string | null;
  Hora?: string | null;
  controlLote: IControlLote;
  LineaId?: number | null;
  IdControlLote: number;
  NombreUsuario?: string | null;
  estadoReproceso?: string | null;
  trazabilidad?: string | null;
  lote?: string | null
}
