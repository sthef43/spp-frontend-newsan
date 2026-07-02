import { IBaseEntity } from "./IBaseEntity";
import { IDobMaestroPieza } from "./IDobMaestroPieza";

export interface IDobCaniosSub extends IBaseEntity {
  dobMaestroPiezaId: number;
  dobMaestroPieza?: IDobMaestroPieza | null;
  cantDob: number;
  cantSol: number;
  diferencia: boolean;
  lpn?: string | null;
  numeroOP?: string | null;
  // solo para el form
  generico?: string | null;
}
