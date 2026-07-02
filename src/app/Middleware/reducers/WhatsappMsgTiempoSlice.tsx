import { IIniState } from "app/models/IIniState";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { WhatsappMsgTiempoService } from "app/services/whatsappMsgTiempo.service";
import { IWhatsappMsgTiempo } from "app/models/IWhatsappMsgTiempo";
const whatsappMsgTiempoService = new WhatsappMsgTiempoService();

class WhatsappMsgTiempoClassSlice extends GenericSlice<IWhatsappMsgTiempo> {
  constructor(private service: WhatsappMsgTiempoService) {
    super("WhatsappMsgTiempo", service);
  }
}
export const WhatsappMsgTiempoSliceRequests = new WhatsappMsgTiempoClassSlice(whatsappMsgTiempoService);

const initialState: IIniState<IWhatsappMsgTiempo> = {
  loading: null,
  data: null
};
