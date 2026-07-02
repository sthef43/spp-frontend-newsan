import { ITurnoExtras } from "app/models/ITurnoExtras";
import { GenericService } from "./generic.service";

export class TurnoExtrasService extends GenericService<ITurnoExtras> {
  Url = "TurnoExtras";
  constructor() {
    super("TurnoExtras");
  }
}
