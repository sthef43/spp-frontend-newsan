import { GenericService } from "app/services/generic.service";
import { IAuditHistorico } from "app/models/IAuditHistorico";

export class AuditHistoricoService extends GenericService<IAuditHistorico> {
  Url = "AuditHistorico";
  constructor() {
    super("AuditHistorico");
  }
}
