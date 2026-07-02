import { IBaseEntity } from "app/models";
import { IPlanProdSppEstadoEmbarque } from "./IPlanProdSppEstadoEmbarque";

export interface IPlanProdSppEmbarque extends IBaseEntity {
  nombreEmbarque: string;
  numeroEmbarque: string;
  po?: string;
  bajada?: string;
  observacion?: string;
  estadoEmbarqueId: number;
  estadoEmbarque?: IPlanProdSppEstadoEmbarque;
}
