import { IBaseEntity } from "./IBaseEntity";

export interface IOQCNuevoPallet extends IBaseEntity {
    lpn: string
    eanCode: string
    codigoProducto: string
    referencia1: string
    referencia2?: string
    numeroSerie: string
    nroOp: string
    lpnCant: number
    partNumber: string
    oem: string
    organizationCode: string
    msn: string
    palletId?: number 
}
