import { IDobCapacidad } from "app/models/IDobCapacidad";
import { GenericService } from "./generic.service";

export class DobCapacidadService extends GenericService<IDobCapacidad> {
  Url = "DobCapacidad";
  constructor() {
    super("DobCapacidad");
  }
}
