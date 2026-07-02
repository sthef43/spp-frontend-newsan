import { IDobHTipoMaquina } from "app/models/IDobHTipoMaquina";
import { GenericService } from "./generic.service";

export class DobHTipoMaquinaService extends GenericService<IDobHTipoMaquina> {
  Url = "DobHTipoMaquina";
  constructor() {
    super("DobHTipoMaquina");
  }
}
