import { IBaseEntity } from "app/models";
import { SEH_Auditoria } from "./SEH_Auditoria";
import { SEH_EPP } from "./SEH_EPP";

export interface SEH_Auditoria_Detalles extends IBaseEntity {
  auditoriaId?: number;
  auditoria?: SEH_Auditoria
  eppId?: number;
  epp?: SEH_EPP;
  cumple: boolean;
}
