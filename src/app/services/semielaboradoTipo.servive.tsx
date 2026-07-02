import { ISemielaboradoTipo } from "app/models/ISemielaboradoTipo";
import { GenericService } from "./generic.service";

export class SemielaboradoTipoService extends GenericService<ISemielaboradoTipo> {
  Url = "SemielaboradoTipo";
  constructor() {
    super("SemielaboradoTipo");
  }
}
