import { IAppUser, IBaseEntity } from ".";
import { IIntEstado } from "./IIntEstado";
import { IIntRemito } from "./IIntRemito";

export interface IIntRecepcionBloq extends IBaseEntity {
    intEstadoId: number
    intEstado?: IIntEstado
    intRemitoId: number
    intRemito?: IIntRemito
    appUserId: number
    appUser?: IAppUser
}