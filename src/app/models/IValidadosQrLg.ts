import { IBaseEntity } from "./IBaseEntity";
import { IValidarQrLg } from "./IValidarQrLg";

export interface IValidadosQrLg extends IBaseEntity {
  validarQrLg?: IValidarQrLg | null;
  validarQrLgId?: number;
  valido?: boolean | null;
}
