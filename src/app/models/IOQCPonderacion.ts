import { IBaseEntity } from "./IBaseEntity";

export interface IOQCPonderacion extends IBaseEntity {
  nombre: string;
  criticidad: string;
  ponderacion: number;
  tipoDefecto: string;
  color: string;
}
