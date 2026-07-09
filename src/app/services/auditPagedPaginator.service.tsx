import { IAuditPagedPaginator } from "app/models/IAuditPagedPaginator";
import { GenericService } from "./generic.service";

export class AuditPagedPaginatorService extends GenericService<IAuditPagedPaginator> {
  Url = "AuditPagedPaginator";
  constructor() {
    super("AuditPagedPaginator");
  }
}
