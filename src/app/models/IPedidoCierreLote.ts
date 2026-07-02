import { IPlanProd } from ".";

export interface IPedidoCierreLote {
  id?: number | null;
  idPlanProd?: number | null;
  estadoPedido?: string | null;
  observaciones?: string | null;
  devolucion?: string | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  deleted?: boolean | null;
  idPlanProdNavigation?: IPlanProd | null;
}
