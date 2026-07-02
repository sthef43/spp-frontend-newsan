import { IDefectoImagen } from "./IDefectoImagen";
import { ILinea } from "./ILinea";

export interface IDefecto {
  idDefecto?: number;
  codigoDefecto: string;
  descripcion: string;
  tipoDefecto: string;
  tipoUnidad?: string;
  subconjunto?: string;
  puesto?: string;
  generico?: string;
  idLinea?: number;
  linea?: ILinea;
  defectoImagen?: IDefectoImagen[];
}
