import { IEmailGroup } from "app/models/IEmailGroup";
import { IIniState } from "app/models/IIniState";
import { EmailGroupService } from "app/services/emailGroup.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { errorNotification } from "../HelperMidleware/errorNotifications";
const emailGroupService = new EmailGroupService();
class emailGroupClassSlice extends GenericSlice<IEmailGroup> {
  constructor(private service: EmailGroupService) {
    super("EmailGroup", service);
  }
  //nuevos asyncthunks aqui
  getAllByPlantIdRequest = createAsyncThunk<IEmailGroup[], number>(
    `EmailGroup/GetAllByPlantId`,
    async (plantId: number, info) => {
      return await errorNotification(() => this.service.GetAllByPlantId(plantId), info);
    }
  );
}
export const EmailGroupSliceRequests = new emailGroupClassSlice(emailGroupService);

const initialState: IIniState<IEmailGroup> = {
  loading: null,
  data: null
};

export const emailGroupSlice = createSlice({
  name: "EmailGroup",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    EmailGroupSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(EmailGroupSliceRequests.getAllByPlantIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(EmailGroupSliceRequests.getAllByPlantIdRequest.rejected, (state) => {
      state.loading = "rejected";
    });
  }
});
