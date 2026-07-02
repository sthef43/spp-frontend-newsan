import { IRechazoPuestoFila } from "app/models/IRechazoPuestoFilas";
import { GenericService } from "./generic.service";

export class RechazoPuestoFilasService extends GenericService<IRechazoPuestoFila> {
  constructor() {
    super("RechazoPuestoFila");
  }
}
