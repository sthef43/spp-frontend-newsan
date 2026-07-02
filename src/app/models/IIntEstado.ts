import { IBaseEntity } from "./IBaseEntity";

export interface IIntEstado extends IBaseEntity {
  nombre?: string | null;
  tipo?: string | null;
}
