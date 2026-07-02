import { IMarca } from "app/models/IMarca";
import { GenericService } from "./generic.service";

export class MarcaService extends GenericService<IMarca> {
  Url = "Marca";
  constructor() {
    super("Marca");
  }
}
