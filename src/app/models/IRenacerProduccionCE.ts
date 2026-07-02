import { IBaseEntity, ITurno } from ".";

export interface IRenacerProduccionCE extends IBaseEntity {
    fecha: string;
    turnoId: number;
    turno?: ITurno;
    modelo: string;
    familia: string;
    cantidad: number
}