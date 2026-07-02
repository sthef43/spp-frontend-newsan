/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { IBaseEntity } from "../../../models/IBaseEntity";
import { IEstacionesBateria } from "./IEstacionesBateria";

export interface IBateriasCodigo extends IBaseEntity {
  codigo: string;
  estacionesBateria?: IEstacionesBateria[];
}
