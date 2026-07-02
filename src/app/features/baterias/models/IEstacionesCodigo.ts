import { IBaseEntity } from "../../../models/IBaseEntity";
import { IEstacionesBateria } from "./IEstacionesBateria";

export interface IEstacionesCodigo extends IBaseEntity {
  codigo: string;
  estacionesBateria?: IEstacionesBateria[];
}
