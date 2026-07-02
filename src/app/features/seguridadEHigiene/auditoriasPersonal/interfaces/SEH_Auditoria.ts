import { IBaseEntity } from "app/models";
import { SEH_Auditoria_Detalles } from "./SEH_Auditoria_Detalles";
import { SP_SearchPersonal } from "../services/SEH_Auditoria.services";
import { SEH_Sancion } from "./SEH_Sancion";

export interface Personal {
  nombre: string;
  apellido: string;
}

export interface SEH_Auditoria extends IBaseEntity {
  personalId: number | string;
  personal?: Personal;
  sp_personal?: SP_SearchPersonal;
  planta: string;
  linea: string;
  area: string;
  empresa: string;
  observaciones: string;
  auditorId?: number;
  auditor?: Personal;
  // fechaSancion?: string;
  // sancion?: boolean;
  // observacionRecursos?: string
  sancionId?: number;
  sancion?: SEH_Sancion;
  detalles?: SEH_Auditoria_Detalles[];
}
