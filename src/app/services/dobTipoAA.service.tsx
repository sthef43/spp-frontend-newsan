import { IDobTipoAA } from "app/models/IDobTipoAA";
import { GenericService } from "./generic.service";

export class DobTipoAAService extends GenericService<IDobTipoAA> {
  Url = "DobTipoAA";
  constructor() {
    super("DobTipoAA");
  }
}
