import { IAuditType } from "app/models/IAuditType";
import { GenericService } from "./generic.service";

export class AuditTypeService extends GenericService<IAuditType> {
  Url = "AuditType";
  constructor() {
    super("AuditType");
  }
}
