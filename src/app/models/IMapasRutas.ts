import { IBaseEntity } from "./IBaseEntity";
import { IRutas } from "./IRutas";
import { IPuesto } from ".";


export interface IMapasRutas extends IBaseEntity {
  rutasId: number;
  ruta: IRutas;
  desdePuestoId: number;
  desdePuesto: IPuesto;
  hastaPuestoId: number;
  hastaPuesto: IPuesto;
  orden: number;
}
