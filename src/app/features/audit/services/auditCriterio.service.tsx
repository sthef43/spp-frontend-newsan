import { IAuditCriterio } from "app/models/IAuditCriterio";
import { GenericService } from "./generic.service";

export class AuditCriterioService extends GenericService<IAuditCriterio> {
  Url = "AuditCriterio";
  constructor() {
    super("AuditCriterio");
  }
}
