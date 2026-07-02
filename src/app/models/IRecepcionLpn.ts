import { IBaseEntity, IOperator } from ".";

export interface IRecepcionLpn extends IBaseEntity {
    lpn: string;
    operatorId?: number;
    operator?: IOperator;
    recepcionado?: boolean;
    enviado?: boolean;
    operatorEnviadoId?: number;
    operatorEnviado?: IOperator
    modelo?: string;
    remito?: number;
    total?: string;
}   