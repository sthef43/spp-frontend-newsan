import { IPlant } from "app/models";
import { IBaseEntity } from "app/models/IBaseEntity";
import { ILineaProduccion } from "app/models/ILineaProduccion"

export interface IDotacionGrupoSectores extends IBaseEntity {
    nombre: string
    detalles: string
    plantId: number
    plant?: IPlant
    lineaProduccionId: number
    lineaProduccion?: ILineaProduccion
    
}