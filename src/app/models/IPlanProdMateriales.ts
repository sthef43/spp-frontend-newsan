import { IPlanProd } from ".";

export interface IPlanProdMateriales {
  id?: number | null;
  codigoModelo?: string | null;
  codigoPautas?: string | null;
  numeroOp?: string | null;
  cantidad?: number | null;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  nombreSupervisor?: string | null;
  deleted?: boolean | null;
  idPlanProd?: number | null;
  descripcion?: string | null;
  idPlanProdNavigation?: IPlanProd | null;
}
