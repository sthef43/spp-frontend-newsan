import { IAreaTraza } from "./IAreaTraza";
import { IGeneric } from "./IGeneric";
import { ILineaProduccion } from "./ILineaProduccion";
import { ITurno } from "./ITurno";

export interface IParadasDeLinea extends IGeneric {
  lineaProduccionId: number;
  lineaProduccion?: ILineaProduccion;
  plantId?: number;
  modeloId: number;
  turnoId: number;
  turno?: ITurno;
  areaTrazaId: number;
  userDni: number;
  discontinuo: boolean;
  fecha: Date;
  horaInicio: string;
  fechaFin: Date | null;
  horaFin: string;
  minutos: number;
  causa: string;
  supervisor?: string;
  areaTraza: IAreaTraza;
}
