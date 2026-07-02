/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { IBaseEntity } from "./IBaseEntity";

export interface IRoutes extends IBaseEntity {
  nombre?: string;
  padre?: string;
  ruta?: string;
  prioridad?: boolean;
}
