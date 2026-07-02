import { IEstadoBaterias } from "app/features/baterias/models/IEstadoBaterias";
import { GenericService } from "../../../services/generic.service";

export class EstadoBateriasService extends GenericService<IEstadoBaterias> {
  Url = "EstadoBaterias";
  constructor() {
    super("EstadoBaterias");
  }
}
