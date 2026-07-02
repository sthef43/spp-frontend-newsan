import { IContUbicacion } from "app/models/IContUbicacion";
import { GenericService } from "./generic.service";

export class ContUbicacionService extends GenericService<IContUbicacion> {
  Url = "ContUbicacion";
  constructor() {
    super("ContUbicacion");
  }
}
