import { GenericService } from "app/services/generic.service";
import { ICtrlPlacasTipoMuestra } from "../models/ICtrlPlacasTipoMuestra";

export class CtrlPlacasTipoMuestraService extends GenericService<ICtrlPlacasTipoMuestra> {
    Url = "CtrlPlacasTipoMuestra";
    constructor() {
        super("CtrlPlacasTipoMuestra");
    }
}