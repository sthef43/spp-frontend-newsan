import { IAppUser } from "./IAppUser";
import { IBaseEntity } from "./IBaseEntity";
import { IFamilia } from "./IFamilia";
import { IMarca } from "./IMarca";
import { IModelo } from "./IModelo";
import { IProducto } from "./IProducto";
import { IProveedores } from "./IProveedores";

export interface IHojaParametro extends IBaseEntity {
  producto?: IProducto | null;
  productoId?: number | null;
  familia?: IFamilia | null;
  familiaId?: number | null;
  modelo?: IModelo | null;
  modeloId?: number | null;
  marca?: IMarca | null;
  marcaId?: number;
  proveedores?: IProveedores | null;
  proveedoresId?: number;
  userCalidad?: IAppUser | null;
  userCalidadId?: number | null;
  userSector?: IAppUser | null;
  userSectorId?: number | null;
  version?: number | null;
  imagen?: string | null;
  fechaCalidad?: string | null;
  fechaSector?: string | null;
  estado?: string | null;
}
