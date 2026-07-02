//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IWhatsappMsgTiempoPlant } from "app/models/WhatsappMsgTiempoPlant";
import { WhatsappMsgTiempoPlantService } from "app/services/whatsappMsgTiempoPlant";
const whatsappMsgTiempoPlantService = new WhatsappMsgTiempoPlantService();

class WhatsappMsgTiempoPlantClassSlice extends GenericSlice<IWhatsappMsgTiempoPlant> {
  constructor(private service: WhatsappMsgTiempoPlantService) {
    super("WhatsappMsgTiempoPlant", service);
  }
}
export const WhatsappMsgTiempoPlantSliceRequests = new WhatsappMsgTiempoPlantClassSlice(whatsappMsgTiempoPlantService);
