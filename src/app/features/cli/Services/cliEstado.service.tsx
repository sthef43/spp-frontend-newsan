import { GenericService } from "app/services/generic.service";
import { ICLIEstado } from "../Models/ICLIEstado";

export class CLIEstadoService extends GenericService<ICLIEstado> {
  Url = "CLIEstado";
  constructor() {
    super("CLIEstado");
  }
}
