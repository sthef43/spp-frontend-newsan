import { IEstacionesBateria } from "app/features/baterias/models/IEstacionesBateria";
import { GenericService } from "../../../services/generic.service";

export class EstacionesBateriaService extends GenericService<IEstacionesBateria> {
  Url = "EstacionesBateria";
  constructor() {
    super("EstacionesBateria");
  }
}
