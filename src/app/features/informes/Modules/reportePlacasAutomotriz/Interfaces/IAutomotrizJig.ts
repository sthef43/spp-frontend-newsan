import { IBaseEntity } from "app/models";

export interface IAutomotrizJig extends IBaseEntity {
    codigo: string
    estado: boolean
    testeo?:string
}