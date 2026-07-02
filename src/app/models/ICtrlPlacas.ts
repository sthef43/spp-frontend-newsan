import { IBaseEntity } from "./IBaseEntity";
import { IAppUser } from "./IAppUser";
import { IPlant } from "./IPlant";
import { ILineaProduccion } from "./ILineaProduccion";
import { ICtrlPlacasHallazgos } from "./ICtrlPlacasHallazgos";
import { ICtrlPlacasTipoMuestra } from "./ICtrlPlacasTipoMuestra";

export interface ICtrlPlacas extends IBaseEntity {
  plant?: IPlant | null;
  plantId: number;
  lineaProduccion?: ILineaProduccion | null;
  lineaProduccionId: number;
  appUser?: IAppUser | null;
  appUserId: number;
  semiElaborado: string;
  modelo: string;
  codigoInit: string;
  detalle?: string
  estado: boolean; //T:bueno
  ctrlPlacasHallazgosId?: number | null;
  ctrlPlacasTipoMuestraId: number
  ctrlPlacasHallazgos?: ICtrlPlacasHallazgos | null;
  ctrlPlacasTipoMuestra?: ICtrlPlacasTipoMuestra | null
}
