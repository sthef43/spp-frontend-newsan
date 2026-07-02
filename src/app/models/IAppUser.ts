/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from "./IBaseEntity";
import { IOperator } from "./IOperator";
import { IPermisos } from "./IPermisos";
import { IStoreroom } from "./IStoreroom";

export interface IAppUser extends IBaseEntity {
  Id?: number;
  email?: string | null;
  username?: string | null;
  operatorId?: number;
  storeroomId?: number;
  permisosId?: number;
  token?: string | null;
  dni?: number;
  operator?: IOperator;
  permisos?: IPermisos;
  storeroom?: IStoreroom;
  password?: string | null;
  validado?: boolean | null;
  telefono?: string;
}
