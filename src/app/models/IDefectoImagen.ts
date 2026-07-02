import { IDefecto } from "./IDefecto";

export interface IDefectoImagen {
  idDefectoImagen: number;
  codigoDefecto: string;
  numImagen: string;
  codigoOrigen: string;
  generico: string;
  idDefecto: number;
  defecto?: IDefecto | null;
  createdDate: string;
  lastModifiedDate: string;
  deleted: boolean;
}
