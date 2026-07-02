import { IBaseEntity, IEmailGroup, ILinea, IOperator } from "app/models";
import { IDobladora } from "app/models/IDobladora";
import { IGrupoFalla } from "./IGrupoFalla";
import { ICausaDobladuraSoldadura } from "./ICausaDobladuraSoldadura";

/**
 * Interfaz que representa la entidad de un Rechazo en Dobladora.
 * Extiende de IBaseEntity para incluir campos de auditoría básicos.
 */
export interface IRechazoDobladora extends IBaseEntity {
  cantidadRechazada: number;
  accionContencion: string;
  accionCorrectiva: string;
  descripcionRechazoOperador: string;
  codigoQr: string;
  familia: string;
  articulo: string;
  descripcionCanio: string;
  urlImagen?: string;
  lpn?: string;
  causaRaizId: number;
  multiplesCausas?: string;
  multiplesDescripcionRechazo?: string;
  emailGroupId: number;
  emailGroup?: IEmailGroup;
  grupoFalla?: IGrupoFalla;
  operatorId: number;
  operator?: IOperator;
  dobladoraId?: number;
  dobladora?: IDobladora;
  lineaId: number;
  linea?: ILinea;
  descripcionRechazoId: number;
  causaDobladuraSoldadura?: ICausaDobladuraSoldadura;
}
