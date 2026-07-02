import { NumberDomain } from "recharts/types/util/types";
import { IBaseEntity } from "./IBaseEntity";

export interface IDobMovimientosDeclaracion extends IBaseEntity {
  id?:number,
  dobProdDeclaracionId?:number,
  fecha?:string,
  cantDeclarada?:Number,
  nombreMaquina?:string
}