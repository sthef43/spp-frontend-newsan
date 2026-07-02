import { IBaseEntity } from "./IBaseEntity";
import { ILineaPuesto } from "./ILineaPuesto";

export interface ILineaPuestoTablero extends IBaseEntity {
  lineaPuestoId: number;
  lineaPuesto?: ILineaPuesto;
  objetivo: number;
  // Solo para usar en el componente
  producido?: number;
  color?: string;
  scrap?: string;
}
