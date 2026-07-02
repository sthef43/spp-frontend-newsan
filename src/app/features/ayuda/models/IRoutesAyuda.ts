import { IBaseEntity } from "../../../models/IBaseEntity";

export interface IRoutesAyuda extends IBaseEntity {
  nombrePDF: string;
  ruta: string;
  url: string;
  padre?: string;
  routesAyudaPadresId?: number;
}
