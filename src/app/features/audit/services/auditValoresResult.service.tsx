import { GenericService } from "app/services/generic.service";
import { IAuditValoresResult } from "../models/IAuditValoresResult";

export class AuditValoresResultService extends GenericService<IAuditValoresResult> {
  Url = "AuditValoresResult";
  constructor() {
    super("AuditValoresResult");
  }
}
