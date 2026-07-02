/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IAppUser } from './IAppUser';
import { IBaseEntity } from './IBaseEntity';
import { IPermisos } from './IPermisos';
import { IRol } from './IRol';
import { IRoutes } from './IRoutes';
import { ISubRol } from './ISubRol';

export interface IPermisosRoutes extends IBaseEntity {
  
    routeId?: number | null;
    permisoId?: number | null;
    permiso?:IPermisos;
    route?:IRoutes;
}