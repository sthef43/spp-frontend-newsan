/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { IAppUser } from "./IAppUser";
import { IBaseEntity } from "./IBaseEntity";
import { IExit } from "./IExit";
import { IPlant } from "./IPlant";
import { IRegistry } from "./IRegistry";
import { ITurno } from "./ITurno";

export interface IOperator extends IBaseEntity {
  deleted?: boolean | null;
  id?: number;
  dni?: number;
  record?: string;
  surname: string;
  plantaId?: number;
  planta?: IPlant;
  turnoId: number;
  turno?: ITurno;
  name: string;
  position?: string;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  appUser?: Array<IAppUser> | null;
  exit?: Array<IExit> | null;
  registry?: Array<IRegistry> | null;
}
