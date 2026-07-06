import { GenericService } from "./generic.service";
import { ICtrlPlacasHallazgos } from "app/models/ICtrlPlacasHallazgos";

export class CtrlPlacasHallazgosService extends GenericService<ICtrlPlacasHallazgos> {
  Url = "CtrlPlacasHallazgos";
  constructor() {
    super("CtrlPlacasHallazgos");
  }
}
