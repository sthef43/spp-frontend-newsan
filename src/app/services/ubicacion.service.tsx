import { IUbicacion } from "app/models/IUbicacion";
import { GenericService } from "./generic.service";

export class UbicacionService extends GenericService<IUbicacion> {
  Url = "Ubicacion";
  constructor() {
    super("Ubicacion");
  }
}
