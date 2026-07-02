import { IDobEstadoPlano } from "app/models/IDobEstadoPlano";
import { GenericService } from "./generic.service";

export class DobEstadoPlanoService extends GenericService<IDobEstadoPlano> {
  Url = "DobEstadoPlano";
  constructor() {
    super("DobEstadoPlano");
  }
}
