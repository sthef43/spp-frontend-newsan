import { IBaseEntity } from "app/models";

export interface IPlanProdSppMes extends IBaseEntity {
    objetivoMensual: number
    diferencia: number
    produccionReal: number
    produccionProyectada: number
    produccionTotal: number
    diasHabiles: string
    porcentajeDiferencia: bigint
    planProdSppId: number
    planProdSpp: IPlanProdSppMes
}