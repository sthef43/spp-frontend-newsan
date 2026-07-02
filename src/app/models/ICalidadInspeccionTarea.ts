import { IBaseEntity } from "./IBaseEntity";

export interface ICalidadInspeccionTarea extends IBaseEntity {  
  tarea: string,
  nivel: number,
  porcentajeMuestras: number,
  sumaRanking:boolean
}