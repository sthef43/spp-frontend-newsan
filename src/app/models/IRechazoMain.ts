import { ICausa } from "./ICausa";
import { IDefecto } from "./IDefecto";

export interface IRechazoMain {
  idRechazoMain: number;
  codigoMain: string | null;
  proveedor: string | null;
  generico: string | null;
  idDefecto: number | null;
  idCausa: number | null;
  idCodigoRechazo: number | null;
  turno: string | null;
  hora: string | null;
  fecha: string | null;
  lineaProduccionId: number | null;
  rechazoPuestoId: number | null;
  defecto: IDefecto;
  causas: ICausa;
  codigoRechazos: any;
}
