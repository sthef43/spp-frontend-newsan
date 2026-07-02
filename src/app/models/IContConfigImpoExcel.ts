import { IBaseEntity } from "./IBaseEntity";
import { IContPlanta } from "./IContPlanta";

export interface IContConfigImpoExcel extends IBaseEntity {
  contPlanta?: IContPlanta;
  contPlantaId?: number;
  linea?: number | null;
  modelo?: number | null;
  lote?: number | null;
  cantidad?: number | null;
  po?: number | null;
  embarque1?: number | null;
  embarque2?: number | null;
  embarque3?: number | null;
  embarque4?: number | null;
  embarque5?: number | null;
  embarque6?: number | null;
  embarque7?: number | null;
  embarque8?: number | null;
  ritmo?: number | null;
}

