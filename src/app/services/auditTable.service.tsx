import { IAuditTable } from "app/models/IAuditTable";
import { GenericService } from "./generic.service";

export class AuditTableService extends GenericService<IAuditTable> {
  Url = "AuditTable";
  constructor() {
    super("AuditTable");
  }
}
