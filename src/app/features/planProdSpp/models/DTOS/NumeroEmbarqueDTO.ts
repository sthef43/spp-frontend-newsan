import { IPlanProdSppEstadoEmbarque } from "../IPlanProdSppEstadoEmbarque";

export interface NumeroEmbarqueDTO {
  numeroEmbarque: string;
  planProdId: number;
  estadoEmbarqueId: number;
  estadoEmbarque: IPlanProdSppEstadoEmbarque;
  bajada: string;
  observacion: string;
  nombreEmbarque: string;
  po: string;
  id: number;
}
