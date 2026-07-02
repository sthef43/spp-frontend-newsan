import { IAreaPagedPaginator } from "app/models/IAreaPagedPaginator";
import { GenericService } from "./generic.service";

export class AreaPagedPaginatorService extends GenericService<IAreaPagedPaginator> {
  Url = "AreaPagedPaginator";
  constructor() {
    super("AreaPagedPaginator");
  }
}
