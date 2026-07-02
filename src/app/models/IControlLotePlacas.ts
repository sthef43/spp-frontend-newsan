import { IEMPQDeclarations } from "./IEMPQDeclarations";
import { IEstadoLote } from "./IEstadoLote";

export interface IControlLotePlacas {
  id?: number | null;
  empQ_Declarations?: IEMPQDeclarations | null;
  empQ_DeclarationsId?: string | null;
  estadoLote?: IEstadoLote | null; //Causa
  estadoLoteId?: number | null;
  nombreSupervisor?: string | null;
  contenidoDefectuoso?: string | null;
  accionCorrectiva?: string | null;
  causaRaiz?: string | null;
  descripcionRechazo?: string | null;
  rechazado?: boolean | false;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  deleted?: boolean | false;
}
