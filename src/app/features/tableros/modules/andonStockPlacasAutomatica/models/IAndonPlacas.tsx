import { IBaseEntity } from "app/models";

export interface IAndonPlacas extends IBaseEntity {
  modelo: string | number;
  im: number | string; // Lo definimos como number | string ya que mencionaste que a veces viene como string
  prod: number;
  cli: number;
}
