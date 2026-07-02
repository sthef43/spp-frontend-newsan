import { IBaseEntity } from ".";

export interface IRenacerReparaciones extends IBaseEntity {
    traza: string;
    modelo: string;
    estado: string;
    posicion: string;
    cantidad: number;
}