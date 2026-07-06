import { ICtrlPlacasHallazgos } from "app/models/ICtrlPlacasHallazgos";
import { GenericService } from "app/services/generic.service";

export class CtrlPlacasHallazgosService extends GenericService<ICtrlPlacasHallazgos> {
  Url = "CtrlPlacasHallazgos";
  constructor() {
    super("CtrlPlacasHallazgos");
  }
}
