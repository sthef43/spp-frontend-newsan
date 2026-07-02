import { ILinea } from "./ILinea";
import { IMotivo } from "./IMotivo";
import { IResponsableInicioLinea } from "./IResponsableInicioLinea";
import { IValida } from "./IValida";

export interface IParada {
  id?: number;
  fecha: Date;
  turno: string;
  target: number;
  producidos: number;
  observacion: string;
  minutosPerdidos: number;
  lineaString: string;
  planta: string;

  motivoId?: number | null;
  validaId: number;
  responsableInicioLineaId: number;
  lineaId: number;
  
  motivo?: IMotivo | null;
  valida?: IValida | null;
  responsableInicioLinea?: IResponsableInicioLinea | null;
  linea?: ILinea | null;
}

