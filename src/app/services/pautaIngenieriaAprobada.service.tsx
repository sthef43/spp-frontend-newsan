import { IPautaIngenieriaAprobada } from "app/models/IPautaIngenieriaAprobada";
import { GenericService } from "./generic.service";

export class PautaIngenieriaAprobadaService extends GenericService<IPautaIngenieriaAprobada> {
  Url = "PautaIngenieriaAprobada";
  constructor() {
    super("PautaIngenieriaAprobada");
  }
}
