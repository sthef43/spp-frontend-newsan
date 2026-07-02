import { IAuditMail } from "app/models/IAuditMail";
import { GenericService } from "./generic.service";

export class AuditMailService extends GenericService<IAuditMail> {
  Url = "AuditMail";
  constructor() {
    super("AuditMail");
  }
}
