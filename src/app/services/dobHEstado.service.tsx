import { IDobHEstado } from "app/models/IDobHEstado";
import { GenericService } from "./generic.service";

export class DobHEstadoService extends GenericService<IDobHEstado> {
  Url = "DobHEstado";
  constructor() {
    super("DobHEstado");
  }
}
