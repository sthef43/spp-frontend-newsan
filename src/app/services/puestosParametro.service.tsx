import { IPuestosParametro } from "app/models/IPuestosParametro";
import { GenericService } from "./generic.service";

export class PuestosParametroService extends GenericService<IPuestosParametro> {
  Url = "PuestosParametro";
  constructor() {
    super("PuestosParametro");
  }
}
