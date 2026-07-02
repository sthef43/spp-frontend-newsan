import { IBaseEntity } from "./IBaseEntity";
import { IFamilia } from "./IFamilia";
import { IModelo } from "./IModelo";
import { IPlant } from "./IPlant";
import { IProducto } from "./IProducto";
import { ISemielaboradoIA } from "./ISemielaboradoIA";

export interface ICalidadDocument  extends IBaseEntity{
    plant?: IPlant | null;
    producto?: IProducto | null;
    familia?: IFamilia | null;
    modelo?: IModelo | null;
    semielaboradoIA?: ISemielaboradoIA | null;
    plantId?: number | 0;
    productoId?: number | 0;
    familiaId?: number | 0;
    modeloId?: number | 0;
    semielaboradoIAId?: number | 0;
    nombre?: string | null;
    descripcion?: string | null;
}