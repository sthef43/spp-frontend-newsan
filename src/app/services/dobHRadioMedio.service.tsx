import { IDobHRadioMedio } from "app/models/IDobHRadioMedio";
import { GenericService } from "./generic.service";

export class DobHRadioMedioService extends GenericService<IDobHRadioMedio> {
  Url = "DobHRadioMedio";
  constructor() {
    super("DobHRadioMedio");
  }
}
