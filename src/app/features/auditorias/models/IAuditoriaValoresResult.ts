import { IBaseEntity } from "app/models";
import { IAuditoriaListaValoresResult } from "./IAuditoriaListaValoresResult";

export interface IAuditoriaValoresResult extends IBaseEntity {
  nombre: string;
  descripcion: string;
  flagCriterio: boolean;
  flagMail: boolean;
  auditoriaListaValoresResultId: number;
  auditoriaListaValoresResult?: IAuditoriaListaValoresResult;
}
