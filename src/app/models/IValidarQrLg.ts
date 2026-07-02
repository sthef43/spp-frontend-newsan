import { IBaseEntity } from "./IBaseEntity";
import { IPlant } from "./IPlant";
import { ILine } from "./ILine";
import { IModelo } from "./IModelo";
import { IFamilia } from "./IFamilia";
import { IProducto } from "./IProducto";
import { IValidadosQrLg } from "./IValidadosQrLg";

export interface IValidarQrLg extends IBaseEntity {
  planta?: IPlant;
  plantaId?: number;
  linea?: ILine;
  lineaId?: number;
  modelo?: IModelo;
  modeloId?: number;
  familia?: IFamilia | null;
  familiaId?: number;
  producto?: IProducto | null;
  productoId?: number;
  codigo?: string | null;
  validadosQrLg?: Array<IValidadosQrLg> | null;
}
