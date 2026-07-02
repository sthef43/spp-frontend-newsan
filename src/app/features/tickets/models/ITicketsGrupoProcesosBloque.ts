import { IBaseEntity } from "app/models/IBaseEntity";
import { ITicketsGrupoProcesos } from "./iTicketsGrupoProcesos";
import { ITicketsItemsProcesos } from "./ITicketsItemsProcesos";

export interface ITicketsGrupoProcesosBloque extends IBaseEntity {
  ticketsGrupoProcesosId: number;
  ticketsGrupoProcesos?: ITicketsGrupoProcesos;
  ticketsItemsProcesosId: number;
  ticketsItemsProcesos?: ITicketsItemsProcesos;
  position?: number;
}
