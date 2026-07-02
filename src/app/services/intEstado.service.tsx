import { IIntEstado } from "app/models/IIntEstado";
import { GenericService } from "./generic.service";

export class IntEstadoService extends GenericService<IIntEstado> {
  Url = "IntEstado";
  constructor() {
    super("IntEstado");
  }
}
