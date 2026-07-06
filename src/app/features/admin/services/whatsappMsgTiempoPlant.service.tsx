import { IWhatsappMsgTiempoPlant } from "app/models/WhatsappMsgTiempoPlant";
import { GenericService } from "app/services/generic.service";

export class WhatsappMsgTiempoPlantService extends GenericService<IWhatsappMsgTiempoPlant> {
  Url = "WhatsappMsgTiempoPlant";
  constructor() {
    super("WhatsappMsgTiempoPlant");
  }
}
