import { IBaseEntity } from "./IBaseEntity";

export interface ILPNPuesto extends IBaseEntity {
  lineaPuestoId: number,
  cantidad?: number,
  lpn?: string,
  tamano: number
  prefijo:string
}