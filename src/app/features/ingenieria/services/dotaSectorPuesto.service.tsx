import { IDotaSectorPuesto } from "app/models/IDotaSectorPuesto";
import { GenericService } from "./generic.service";

export class DotaSectorPuestoService extends GenericService<IDotaSectorPuesto> {
  url = "DotaSectorPuesto";
  constructor() {
    super("DotaSectorPuesto");
  }
}
