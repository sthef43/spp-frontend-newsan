import { IDobHTipoUbicacion } from "app/models/IDobHTipoUbicacion";
import { GenericService } from "./generic.service";

export class DobHTipoUbicacionService extends GenericService<IDobHTipoUbicacion> {
  Url = "DobHTipoUbicacion";
  constructor() {
    super("DobHTipoUbicacion");
  }
}
