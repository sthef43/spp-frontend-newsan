import { IDotaPuesto } from "app/models/IDotaPuesto";
import { GenericService } from "./generic.service";

export class DotaPuestoService extends GenericService<IDotaPuesto> {
  url = "DotaPuesto";
  constructor() {
    super("DotaPuesto");
  }
}
