import { IRenacerProduccionCE } from "app/models/IRenacerProduccionCE";
import { GenericService } from "./generic.service";

export class RenacerProduccionCEService extends GenericService<IRenacerProduccionCE> {
    Url = "RenacerProduccionCE";
    constructor() {
        super("RenacerProduccionCE")
    }
}