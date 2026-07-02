import { GenericService } from "./generic.service";
import { ILPNPuesto } from "app/models/ILPNPuesto";

export class LPNPuestoService extends GenericService<ILPNPuesto> {
  Url = "LPNPuesto";
  constructor() {
    super("LPNPuesto");
  }
}
