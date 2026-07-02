import { IEstacionesCodigo } from "app/features/baterias/models/IEstacionesCodigo";
import { GenericService } from "../../../services/generic.service";

export class EstacionesCodigoService extends GenericService<IEstacionesCodigo> {
  Url = "EstacionesCodigo";
  constructor() {
    super("EstacionesCodigo");
  }
}
