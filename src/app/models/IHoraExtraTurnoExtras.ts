import { IBaseEntity } from "./IBaseEntity";
import { IHoraExtra } from "./IHoraExtra";
import { ITurnoExtras } from "./ITurnoExtras";
import { ITurnoExtrasLineaProduccion } from "./ITurnoExtrasLineaProduccion";

export interface IHoraExtraTurnoExtras extends IBaseEntity {
  horaExtraId?: number;
  horaExtra?: IHoraExtra;
  turnoExtrasId: number;
  turnoExtras?: ITurnoExtras;
  turnoExtrasLineaProduccion?: ITurnoExtrasLineaProduccion[];
  comedor: boolean;
  transporte: boolean;
  fecha: string;
}
