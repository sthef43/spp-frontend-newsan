import { IDotaSector } from "app/models/IDotaSector";
import { GenericService } from "app/services/generic.service";

export class DotaSectorService extends GenericService<IDotaSector> {
  url = "DotaSector";
  constructor() {
    super("DotaSector");
  }
}
