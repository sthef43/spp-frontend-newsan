import { GenericService } from "app/services/generic.service";
import { IDotaPuesto } from "app/models/IDotaPuesto";

export class DotaPuestoService extends GenericService<IDotaPuesto> {
  url = "DotaPuesto";
  constructor() {
    super("DotaPuesto");
  }
}
