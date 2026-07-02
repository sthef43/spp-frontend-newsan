import { IBaseEntity } from "app/models";
import { IAuditoriaListaValores } from "./IAuditoriaListaValores";
import { IAuditoriaValores } from "./IAuditoriaValores";

export interface IAuditoriaValoresListaBloq extends IBaseEntity {
  auditoriaListaValoresId: number;
  auditoriaListaValores?: IAuditoriaListaValores;
  auditoriaValoresId: number;
  auditoriaValores?: IAuditoriaValores[];
}
