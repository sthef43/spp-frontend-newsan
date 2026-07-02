import { IPlanProdSppEstadoEmbarque } from "../IPlanProdSppEstadoEmbarque";

export interface EmbarqueDTO {
  id: number;
  nombreEmbarque: string;
  numeroEmbarque: string;
  po: string;
  bajada: string;
  estadoEmbarqueId: number;
  estadoEmbarque: IPlanProdSppEstadoEmbarque;
  planProdSppId: number;
  observacion?: string;
}
