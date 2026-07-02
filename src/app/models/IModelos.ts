import { ISemielaboradoModelos } from "./ISemielaboradoModelos";

export interface IModelos {
  idModelo?: number;
  nombre?: string;
  codigoModelo?: string;
  descripcion?: string;
  tipoUnidad?: string;
  idTarget?: number | null;
  codigoSgs?: number | null;
  capacidadTipo?: string;
  modeloTps?: number | null;
  temporada?: number | null;
  planprod?: any | null;
  codigoSGS?: string | null;
  semielaboradoModelos?: ISemielaboradoModelos[];
}
