import { IBaseEntity } from "./IBaseEntity";

export interface ISubLineaScrap extends IBaseEntity {
  familia: string;
  codigo: string;
  total: number;
  lineaPuestoId: number;
}
