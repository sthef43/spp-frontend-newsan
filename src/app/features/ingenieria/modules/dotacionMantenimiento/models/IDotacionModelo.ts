import { IBaseEntity } from "../../../../../models/IBaseEntity";

export interface IDotacionModelo extends IBaseEntity {
  nombre: string;
  potencia: number;
}
