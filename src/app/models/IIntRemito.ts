import { IAppUser } from "./IAppUser";
import { IAreaTraza } from "./IAreaTraza";
import { IBaseEntity } from "./IBaseEntity";
import { IIntEstado } from "./IIntEstado";
import { IPlant } from "./IPlant";

export interface IIntRemito extends IBaseEntity {
  appUserId?: number | null;
  appUser?: IAppUser | null;
  areaDestinoId?: number | null;
  areaDestino?: IAreaTraza | null;
  plantOrigenId?: number | null;
  plantOrigen?: IPlant | null;
  plantDestinoId?: number | null;
  plantDestino?: IPlant | null;
  referenciaDestino?: string | null;
  observacion?: string | null;
  intEstadoId?: number | null;
  intEstado: IIntEstado | null;
  rechazado?: boolean
}
