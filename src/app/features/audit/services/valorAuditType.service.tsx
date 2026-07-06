import { IValorAuditType } from "app/models/IValorAuditType";
import { GenericService } from "app/services/generic.service";

export class ValorAuditTypeService extends GenericService<IValorAuditType> {
  Url = "ValorAuditType";
  constructor() {
    super("ValorAuditType");
  }
}
