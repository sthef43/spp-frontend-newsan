import { IBaseEntity } from "app/models";
import { SEH_Auditoria_Detalles } from "./SEH_Auditoria_Detalles";

export interface SEH_Sancion extends IBaseEntity {
      fecha: string,
      observacion: string
      auditorias: SEH_Auditoria_Detalles[]
}