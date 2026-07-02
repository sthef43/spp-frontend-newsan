import { IContObservacion } from "app/models/IContObservacion";
import { GenericService } from "./generic.service";

export class ContObservacionService extends GenericService<IContObservacion> {
  Url = "ContObservacion";
  constructor() {
    super("ContObservacion");
  }
}
