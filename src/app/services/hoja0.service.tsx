import { IHoja0 } from "app/models/IHoja0";
import { GenericService } from "./generic.service";

export class Hoja0Service extends GenericService<IHoja0> {
  Url = "Hoja0";
  constructor() {
    super("Hoja0");
  }
}
