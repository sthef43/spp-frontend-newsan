import { GenericService } from "./generic.service";
import { IContEstado } from "app/models/IContEstado";

export class ContEstadoService extends GenericService<IContEstado> {
  Url = "ContEstado";
  constructor() {
    super("ContEstado");
  }
}
