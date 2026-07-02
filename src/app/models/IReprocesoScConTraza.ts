import { IControlLote } from "./IControlLote";

export interface IReprocesoScConTraza {
    IdReprocesoLineasc: number;
    codigoNewsan?: string | null;
    Fecha?: string | null;
    controlLote: IControlLote;
    IdControlLote: number;
    NombreUsuario?: string | null;
    estadoReproceso?: string | null;
    trazabilidad?: string | null;
}