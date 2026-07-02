/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IBaseEntity } from "./IBaseEntity";
import { IPermisos } from "./IPermisos";
import { IRegistry } from "./IRegistry";
import { ITodo } from "./ITodo";

export interface ISubRol extends IBaseEntity {
  createdDate?: string | null;
  deleted?: boolean | null;
  id?: number;
  name: string | null;
  createDate?: string | null;
  lastModifiedDate?: string | null;
  permisos?: Array<IPermisos> | null;
  registry?: Array<IRegistry> | null;
  todo?: Array<ITodo> | null;
}
