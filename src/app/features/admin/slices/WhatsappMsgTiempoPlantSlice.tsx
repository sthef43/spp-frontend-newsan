//<IAuth, IAuthUser>
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IWhatsappMsgTiempoPlant } from "app/models/WhatsappMsgTiempoPlant";
import { WhatsappMsgTiempoPlantService } from "../services/whatsappMsgTiempoPlant.service";
const whatsappMsgTiempoPlantService = new WhatsappMsgTiempoPlantService();

class WhatsappMsgTiempoPlantClassSlice extends GenericSlice<IWhatsappMsgTiempoPlant> {
  constructor(private service: WhatsappMsgTiempoPlantService) {
    super("WhatsappMsgTiempoPlant", service);
  }
}
export const WhatsappMsgTiempoPlantSliceRequests = new WhatsappMsgTiempoPlantClassSlice(whatsappMsgTiempoPlantService);
