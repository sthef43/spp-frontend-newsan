import { IDotaSectorPuesto } from "app/models/IDotaSectorPuesto";
import { GenericService } from "app/services/generic.service";

export class DotaSectorPuestoService extends GenericService<IDotaSectorPuesto> {
  url = "DotaSectorPuesto";
  constructor() {
    super("DotaSectorPuesto");
  }
}
