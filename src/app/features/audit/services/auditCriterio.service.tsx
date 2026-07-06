import { IAuditCriterio } from "app/models/IAuditCriterio";
import { GenericService } from "app/services/generic.service";

export class AuditCriterioService extends GenericService<IAuditCriterio> {
  Url = "AuditCriterio";
  constructor() {
    super("AuditCriterio");
  }
}
