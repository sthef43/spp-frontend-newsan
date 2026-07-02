import { IBaseEntity } from "./IBaseEntity";
import { IHoraExtraTurnoExtras } from "./IHoraExtraTurnoExtras";
import { ILineaProduccion } from "./ILineaProduccion";

export interface ITurnoExtrasLineaProduccion extends IBaseEntity {
  lineaProduccionId: number;
  lineaProduccion?: ILineaProduccion;
  horaExtraTurnoExtrasId: number;
  horaExtraTurnoExtras?: IHoraExtraTurnoExtras;
  cantidad: number;
  detalle: string | null;
}
