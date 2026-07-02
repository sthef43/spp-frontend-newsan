import { IRenacerIngresoPlacas } from "app/models/IRenacerIngresoPlacas";
import { GenericService } from "./generic.service";

export class RenacerIngresoPlacasService extends GenericService<IRenacerIngresoPlacas> {
    url = "RenacerIngresoPlacas"
    constructor() {
        super("RenacerIngresoPlacas")
    }
}