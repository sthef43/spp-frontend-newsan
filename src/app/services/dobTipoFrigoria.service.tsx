import { IDobTipoFrigoria } from "app/models/IDobTipoFrigoria";
import { GenericService } from "./generic.service";

export class DobTipoFrigoriaService extends GenericService<IDobTipoFrigoria> {
  Url = "DobTipoFrigoria";
  constructor() {
    super("DobTipoFrigoria");
  }
}
