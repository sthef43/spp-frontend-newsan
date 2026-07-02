import { GenericService } from "../../../services/generic.service";
import { IOQCCategoria } from "app/models/IOQCCategoria";

export class OQCCategoriaService extends GenericService<IOQCCategoria> {
  Url = "OQCCategoria";
  constructor() {
    super("OQCCategoria");
  }
}
