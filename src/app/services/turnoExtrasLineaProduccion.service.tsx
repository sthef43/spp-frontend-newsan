import { GenericService } from "./generic.service";
import { ITurnoExtrasLineaProduccion } from "app/models/ITurnoExtrasLineaProduccion";

export class TurnoExtrasLineaProduccionService extends GenericService<ITurnoExtrasLineaProduccion> {
  Url = "TurnoExtrasLineaProduccion";
  constructor() {
    super("TurnoExtrasLineaProduccion");
  }
}
