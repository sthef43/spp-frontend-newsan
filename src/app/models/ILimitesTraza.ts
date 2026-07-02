import { IBaseEntity } from "./IBaseEntity";
import { ILimites } from "./ILimites";

export interface ILimitesTraza extends IBaseEntity {
  turno?: string | null;
  verificacion1?: boolean | null;
  verificacion2?: boolean | null;
  verificacion3?: boolean | null;
  verificacion4?: boolean | null;
  observaciones?: string | null;
  limitesId?: number | null;
  identificadorLinea?: number | null;
  correccion?: string | null;
  limites?: ILimites | null;
  userName: string;
  userDni: number;
  fecha: Date;
}
