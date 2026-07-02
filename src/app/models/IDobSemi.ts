import { IBaseEntity } from "./IBaseEntity";
import { IDobTipoAA } from "./IDobTipoAA";
import { IDobCapacidad } from "./IDobCapacidad";
import { IDobTipoFrigoria } from "./IDobTipoFrigoria";
import { IDobProveedor } from "./IDobProveedor";
import { IDobSubEnsamble } from "./IDobSubEnsamble";
import { IDobPlano } from "./IDobPlano";

export interface IDobSemi extends IBaseEntity {
  codigo?: string | null;
  descripcion?: string | null;
  dobTipoAA?: IDobTipoAA;
  dobCapacidad?: IDobCapacidad;
  dobTipoFrigoria?: IDobTipoFrigoria;
  dobProveedor?: IDobProveedor;
  dobSubEnsamble?: IDobSubEnsamble;
  versionProducto?: string;
  versionPieza?: string;
  n1SubEnsamble?: number | null;
  n2SubEnsamble?: number | null;
  dobPlano?: Array<IDobPlano> | null;
}
