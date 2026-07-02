import { GenericService } from "app/services/generic.service";
import { SEH_Auditoria_Detalles } from "../interfaces/SEH_Auditoria_Detalles";

export class SEH_Auditoria_DetallesServices extends GenericService<SEH_Auditoria_Detalles> {
  constructor() {
    super("SEHAuditoriaDetalles");
  }
}
