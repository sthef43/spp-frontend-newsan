import { IHora } from "./IHora";

export interface IPeriodoHora {
  id?: number;
  horaId: number;
  periodoId: number;
  hora: IHora;
}
