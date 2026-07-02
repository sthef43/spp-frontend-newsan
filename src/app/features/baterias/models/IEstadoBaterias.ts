import { IBaseEntity } from "../../../models/IBaseEntity";
import { IEstacionesBateria } from "./IEstacionesBateria";

export interface IEstadoBaterias extends IBaseEntity {
  nombre: string;
  estacionesBateria?: IEstacionesBateria[];
}
