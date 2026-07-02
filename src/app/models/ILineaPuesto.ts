import { IBaseEntity } from "./IBaseEntity";
import { ILPNPuesto } from "./ILPNPuesto";
import { ILineaProduccion } from "./ILineaProduccion";
import { ILineaPuestoTablero } from "./ILineaPuestoTablero";
import { IPuesto } from ".";

export interface ILineaPuesto extends IBaseEntity {
  puestoId: number;
  puesto: IPuesto;
  lineaProduccionId: number;
  lineaProduccion: ILineaProduccion;
  declararEBS?: boolean;
  puestoDeRechazo?: boolean;
  tipo?: string;
  esLPN?: boolean;
  lpnPuesto?: ILPNPuesto;
  contingencia: boolean;
  lineaPuestoTablero?: ILineaPuestoTablero;
  loginOperario?: boolean
  critico?: boolean
  automotriz: boolean
}
