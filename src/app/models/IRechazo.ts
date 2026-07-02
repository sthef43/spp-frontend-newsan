import { ICalidadInspeccionesRechazo } from "./ICalidadInspeccionesRechazo";
import { ICodigoRechazos } from "./ICodigoRechazos";

export interface IRechazo {
  idRechazo?: number | null;
  fecha: string;
  hora: string;
  linea: string;
  barcode: string;
  puesto: string;
  estado: string;
  horaDesde: string;
  horaHasta: string;
  idLinea: number;
  codigoRechazo: number;
  cantidad: number;
  turno: string;
  idCodigoRechazo: number;
  codigoRechazoModel?: ICodigoRechazos | null;
  total?:number | 0;
  familia?: string | null;
  descripcionRechazo?: string | null;
  calidadInspeccionesRechazo?: [ICalidadInspeccionesRechazo] | null;
}
