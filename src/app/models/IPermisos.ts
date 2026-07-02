/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IAppUser } from "./IAppUser";
import { IBaseEntity } from "./IBaseEntity";
import { IRol } from "./IRol";
import { ISubRol } from "./ISubRol";
import { IPermisosRoutes } from "./IPermisosRoutes";
export interface IPermisos extends IBaseEntity {
  deleted?: boolean | null;
  id?: number;
  rolId?: number | null;
  subrolId?: number | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  rol?: IRol;
  subrol?: ISubRol;
  appUser?: Array<IAppUser> | null;
  permisosRoutes?: IPermisosRoutes[];
}
