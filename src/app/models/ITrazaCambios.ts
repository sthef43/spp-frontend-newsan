import { IBaseEntity } from './IBaseEntity'
export interface ITrazaCambios extends IBaseEntity {
  piezaAnterior: string,
  piezaNueva:string
}