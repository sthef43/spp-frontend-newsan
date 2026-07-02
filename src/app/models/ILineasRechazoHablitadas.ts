
import { IBaseEntity } from "./IBaseEntity";
import { ILinea } from "./ILinea";

export interface ILineasRechazoHabilitadas extends IBaseEntity{
  lineaId:number,
  linea?:ILinea,
  processorIdDesde:number,
  processorIdHasta:number,
  puestoCargadora:boolean,
  puestoRunTest:boolean,
  puestoProTrace:boolean,
  identificadorLinea:number
}