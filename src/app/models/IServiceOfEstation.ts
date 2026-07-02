/* tslint:disable */
/* eslint-disable */

import { IAppUser } from "./IAppUser";
import { IBaseEntity } from "./IBaseEntity";
import { IExit } from "./IExit";
import { IRegistry } from "./IRegistry";

export interface IServiceOfEstation extends IBaseEntity {
  barcode: string;
  op: string;
  modelo: string;
  lote: string;
  panel: string;
  semielaborado: string;
  controldeplacas: boolean;
  estado: string;
  mensaje: string;
}
