import { IBaseEntity } from "./IBaseEntity";
import { ILineaProduccion } from "./ILineaProduccion";
import { IPlant } from "./IPlant";
import { ISector } from "./ISector";
import { ITurno } from "./ITurno";

export interface IInformesPI extends IBaseEntity {
  plantId: number;
  plant?: IPlant;
  lineaProduccionId: number;
  lineaProduccion?: ILineaProduccion;
  turnoId: number;
  turno?: ITurno;
  sectorId: number;
  sector?: ISector;
  asunto: string;
  descripcion: string;
  solucion: string;
  fecha: string;
  desdeHora: string;
  hastaHora: string;
  userDni: number;
  usuario: string;
}
