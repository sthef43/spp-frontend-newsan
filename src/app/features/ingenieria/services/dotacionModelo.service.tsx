import { GenericService } from "app/services/generic.service";
import { IDotacionModelo } from "app/features/ingenieria/modules/dotacionMantenimiento/models/IDotacionModelo";

export class DotacionModeloService extends GenericService<IDotacionModelo> {
  Url = "DotacionModelo";
  constructor() {
    super("DotacionModelo");
  }
}
