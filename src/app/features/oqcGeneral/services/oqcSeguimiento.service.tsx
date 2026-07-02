import { IOQCSeguimiento } from "app/models/IOQCSeguimiento";
import { GenericService } from "../../../services/generic.service";

export class OQCSeguimientoService extends GenericService<IOQCSeguimiento> {
  Url = "OQCSeguimiento";
  constructor() {
    super("OQCSeguimiento");
  }
}
