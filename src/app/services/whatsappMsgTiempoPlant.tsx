import { IWhatsappMsgTiempoPlant } from "app/models/WhatsappMsgTiempoPlant";
import { GenericService } from "./generic.service";

export class WhatsappMsgTiempoPlantService extends GenericService<IWhatsappMsgTiempoPlant> {
  Url = "WhatsappMsgTiempoPlant";
  constructor() {
    super("WhatsappMsgTiempoPlant");
  }
}
