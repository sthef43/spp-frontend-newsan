import { IBaseEntity } from "./IBaseEntity";
import { IDobMovimientosDeclaracion } from "./IDobMovimientosDeclaracion";

export interface IDobProdDeclaracion extends IBaseEntity {
  id?:number,
  fecha:string,
  op:string,
  semielaborado:string,
  familia:string,
  totalEBS:number,
  cantidadOP:number,
  totalDeclarado:number,
  descripcion:string
  movimientos?:IDobMovimientosDeclaracion[]

}