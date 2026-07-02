import { ISubTipoDetalle } from "app/models/ISubTipoDetalle";
import { GenericService } from "./generic.service";

export class SubTipoDetalleService extends GenericService<ISubTipoDetalle> {
  Url = "SubTipoDetalle";
  constructor() {
    super("SubTipoDetalle");
  }
}
