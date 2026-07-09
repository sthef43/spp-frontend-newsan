import { IIniState } from "app/models/IIniState";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { WhatsappMsgService } from "app/services/whatsappMsg.service";
import { IWhatsappMsg } from "app/models/IWhatsappMsg";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
const whatsappMsgService = new WhatsappMsgService();

class WhatsappMsgClassSlice extends GenericSlice<IWhatsappMsg> {
  constructor(private service: WhatsappMsgService) {
    super("WhatsappMsg", service);
  }

  GetAllByWhatsapAsignacionId = createAsyncThunk<IWhatsappMsg[], number>(
    `WhatsappMsg/GetAllByWhatsapAsignacionId`, async (asignacionId, info) => {
      return await errorNotification(() => this.service.GetAllByWhatsapAsignacionId(asignacionId), info)
    }
  )
}
export const WhatsappMsgSliceRequests = new WhatsappMsgClassSlice(whatsappMsgService);

const initialState: IIniState<IWhatsappMsg> = {
  loading: null,
  data: null
};
