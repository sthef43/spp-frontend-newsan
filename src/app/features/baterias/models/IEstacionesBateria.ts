import { IBaseEntity } from "../../../models/IBaseEntity";
import { IBateriasCodigo } from "./IBateriasCodigo";
import { IEstacionesCodigo } from "./IEstacionesCodigo";
import { IEstadoBaterias } from "./IEstadoBaterias";

export interface IEstacionesBateria extends IBaseEntity {
  bateriaId?: number;
  estacionId?: number;

  estadoId?: number;
  bateria?: IBateriasCodigo;
  estacion?: IEstacionesCodigo;
  estado?: IEstadoBaterias;
}
