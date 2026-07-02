import { IBaseEntity } from "app/models";
import { IDotacionGrupoSectores } from "./IDotacionGrupoSectores";
import { IDotacionSector } from "./IDotacionSector";

export interface IDotacionGrupoSectoresBloque extends IBaseEntity {
    dotacionSectoresId: number
    dotacionSectores?: IDotacionSector
    dotacionGrupoSectoresId: number
    dotacionGrupoSectores?: IDotacionGrupoSectores
}