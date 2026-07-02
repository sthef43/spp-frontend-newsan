import { IAppUser } from "./IAppUser";
import { IBaseEntity } from "./IBaseEntity";
import { IIntEstado } from "./IIntEstado";
import { IIntRemito } from "./IIntRemito";
import { IPlant } from "./IPlant";

export interface IIntRemitoPadre extends IBaseEntity {
  appUserId?: number | 0;
  appUser?: IAppUser | null;
  plantOrigenId?: number | 0;
  plantOrigen?: IPlant | null;
  plantDestinoId?: number | 0;
  plantDestino?: IPlant | null;
  intEstadoId?: number | 0;
  intEstado?: IIntEstado | null;
  patente?: string | null;
  chofer?: string | null;
  precintoCandado?: string | null;
  contenedor?: string | null;
  observacion?: string | null;
  intRemitos?: IIntRemito[] | null;
}
