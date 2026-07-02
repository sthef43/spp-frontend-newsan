import { IBaseEntity } from ".";


export interface IRenacerIngresoPlacas extends IBaseEntity {
    fecha: string;
    remito: string;
    modelo: string;
    cantidadPlacas: number;
    comentarios: string;
}