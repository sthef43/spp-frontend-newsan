import { GenericService } from "app/services/generic.service";
import { IAuditoriaNivelItem } from "../models/IAuditoriaNivelItem";

export class AuditoriaNivelItemService extends GenericService<IAuditoriaNivelItem> {
  constructor() {
    super("AuditoriaNivelItem");
  }
}
