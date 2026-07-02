import { IBaseEntity } from "./IBaseEntity";
import { IContEmbarque } from "./IContEmbarque";
import { IContPlanta } from "./IContPlanta";

export interface IContPlanProduccion extends IBaseEntity {
  contPlanta?: IContPlanta;
  contPlantaId?: number; 
  lineaExcel?: number | null;
  linea?: string | null;
  modelo?: string | null;
  lote?: string | null;
  cantidad?: string | null; 
  po?: string | null;    
  abierto?: boolean; 
  contEmbarque?: Array<IContEmbarque> | null;
}
