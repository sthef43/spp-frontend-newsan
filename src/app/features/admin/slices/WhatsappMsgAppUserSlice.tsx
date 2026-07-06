//<IAuth, IAuthUser>
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { WhatsappMsgAppUserService } from "../services/whatsappMsgAppUser.service";
import { IWhatsappMsgAppUser } from "app/models/IIWhatsappMsgAppUser";
import { IAppUser, IIniState } from "app/models";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
const whatsappMsgAppUserService = new WhatsappMsgAppUserService();

class WhatsappMsgAppUserClassSlice extends GenericSlice<IWhatsappMsgAppUser> {
  constructor(private service: WhatsappMsgAppUserService) {
    super("WhatsappMsgAppUser", service);
  }

  GetAllByOpcionAsign = createAsyncThunk<IWhatsappMsgAppUser[], { opcionId, whatsappMsgId }>(
    `WhatsappMsgAppUser/GetAllByOpcionAsign`, async ({ opcionId, whatsappMsgId }, info) => {
      return await errorNotification(() => this.service.GetAllByOpcionAsign(opcionId, whatsappMsgId), info)
    }
  )

  GetAllUsersWithNoAssigment = createAsyncThunk<IAppUser[], { opcionId, whatsappMsgId, plantId }>(
    `WhatsappMsgAppUser/GetAllUsersWithNoAssigment`, async ({ opcionId, whatsappMsgId, plantId}, info) => {
      return await errorNotification(() => this.service.GetAllUsersWithNoAssigment(opcionId, whatsappMsgId, plantId), info)
    }
  )

}
export const WhatsappMsgappUserSliceRequests = new WhatsappMsgAppUserClassSlice(whatsappMsgAppUserService);

const initialState: IIniState<IWhatsappMsgAppUser> = {
  loading: null,
  data: null
};

export const ubicacionSlice = createSlice({
  name: "WhatsappMsgAppUser",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    WhatsappMsgappUserSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});