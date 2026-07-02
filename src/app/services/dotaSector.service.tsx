import { IDotaSector } from "app/models/IDotaSector";
import { GenericService } from "./generic.service";

export class DotaSectorService extends GenericService<IDotaSector> {
  url = "DotaSector";
  constructor() {
    super("DotaSector");
  }
}
