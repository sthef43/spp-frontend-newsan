import { IAuditPagedPaginator } from "app/models/IAuditPagedPaginator";
import { GenericService } from "app/services/generic.service";

export class AuditPagedPaginatorService extends GenericService<IAuditPagedPaginator> {
  Url = "AuditPagedPaginator";
  constructor() {
    super("AuditPagedPaginator");
  }
}
