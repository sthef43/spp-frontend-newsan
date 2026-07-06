import { IIniState } from "app/models/IIniState";
//<IAuth, IAuthUser>
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { WhatsappMsgTiempoService } from "../services/whatsappMsgTiempo.service";
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
