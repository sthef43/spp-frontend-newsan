import { IBaseEntity, IOperator } from "app/models";

export interface ItemsProcesosResultadosDTO extends IBaseEntity {
    nombre: string;
    estadoAprobado: boolean;
    comentarioAprobado: string;
    operatorId: number
    operator?: IOperator
    ticketsGrupoProcesosId: number
    rolId: number
    position: number
}