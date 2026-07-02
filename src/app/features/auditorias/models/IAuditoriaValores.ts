import { IBaseEntity } from "app/models";
import { IAuditoriaValoresListaBloq } from "./IAuditoriaValoresListaBloq";

export interface IAuditoriaValores extends IBaseEntity {
  nombre: string;
  descripcion: string;
  flagCriterio: boolean;
  flagMail: boolean;
  auditoriaValoresListaBloq?: IAuditoriaValoresListaBloq[];
}
