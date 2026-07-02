/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */


import { IPuesto } from ".";
import { IBaseEntity } from "./IBaseEntity";
import { IProducto } from "./IProducto";



export interface ITrazaProductoPuesto extends IBaseEntity {
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  deleted?: boolean;
  id?: number;
  productoId: number;
  producto?: IProducto;
  puestoId: number;
  puesto?: IPuesto;
}
