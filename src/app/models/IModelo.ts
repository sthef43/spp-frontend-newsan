import { IBaseEntity } from "./IBaseEntity";
import { IFamilia } from "./IFamilia";
import { IOperator } from "./IOperator";
export interface IModelo extends IBaseEntity {
  familiaId?: number;
  familia?: IFamilia;
  nombre: string;
  descripcion: string;
  tipoUnidad?: string;
  eancode?: string;
  Muestras?: number;
  pallet?: number;
  operatorId?: number;
  operator?: IOperator;
  compania?: string;
  modeloRenacer?: boolean
}
