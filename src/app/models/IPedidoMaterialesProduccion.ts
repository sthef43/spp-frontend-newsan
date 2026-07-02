import { IPlanProd } from ".";

export interface IPedidoMaterialesProduccion {
  id?: number | null;
  idPlanProd?: number | null;
  estadoPedido?: string | null;
  observaciones?: string | null;
  devolucion?: string | null;
  nroSi?: string | null;
  nroPo?: string | null;
  nroEmbarque?: string | null;
  eta?: string | null;
  fechaLibEmbarque?: string | null;
  estadoOpReparacion?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  deleted?: boolean | null;
  idPlanProdNavigation?: IPlanProd | null;
}
