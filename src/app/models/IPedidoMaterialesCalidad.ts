import { IControlLote } from ".";

export interface IPedidoMaterialesCalidad {
  id?: number | null;
  idControlLote?: number | null;
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
  idControlLoteNavigation?: IControlLote | null;
}
