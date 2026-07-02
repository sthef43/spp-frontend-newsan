import { IBaseEntity, IPlant } from ".";

export interface IWhatsappMsgOpcionAsignacion extends IBaseEntity {
    nombre: string
    descripcion: string
    plantId: number
    Plant?: IPlant
}