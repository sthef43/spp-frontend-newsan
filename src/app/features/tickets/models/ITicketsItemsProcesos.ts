import { IBaseEntity, IRol } from "app/models";
import { ITicketsGrupoProcesosBloque } from "./ITicketsGrupoProcesosBloque";
import { ITicketsItemsProcesosBloque } from "./ITicketsItemsProcesosBloque";

export interface ITicketsItemsProcesos extends IBaseEntity {
  nombre: string;
  detalles: string;
  aprobacionIntermedia: boolean;
  rolId: number;
  rol?: IRol;
  ticketsGrupoProcesos?: ITicketsGrupoProcesosBloque[];
  ticketsItemsProcesosBloques?: ITicketsItemsProcesosBloque[];
}
