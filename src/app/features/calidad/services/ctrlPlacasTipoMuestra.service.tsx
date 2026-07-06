import { ICtrlPlacasTipoMuestra } from "app/models/ICtrlPlacasTipoMuestra";
import { GenericService } from "app/services/generic.service";

export class CtrlPlacasTipoMuestraService extends GenericService<ICtrlPlacasTipoMuestra> {
  Url = "CtrlPlacasTipoMuestra";
  constructor() {
    super("CtrlPlacasTipoMuestra");
  }
}
