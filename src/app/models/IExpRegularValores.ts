import { IBaseEntity } from "./IBaseEntity";

export interface IExpRegularValores extends IBaseEntity {
  expRegularNombre?: string;
  valor?: string;
  formatoVariable?: string;
  caracteres?: number;
  caracteresPrefijo?: number;
  caracteresSufijo?: number;
}
