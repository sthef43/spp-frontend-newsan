import { IServiceOfEstation } from "app/models/IServiceOfEstation";
import { IIniState } from "app/models/IIniState";
import { ServiceOfEstationService } from "app/services/serviceOfEstation.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { errorNotification } from "../HelperMidleware/errorNotifications";
const serviceOfEstationService = new ServiceOfEstationService();

class ServiceOfEstationClassSlice extends GenericSlice<IServiceOfEstation> {
  constructor(private service: ServiceOfEstationService) {
    super("ServiceOfEstation", service);
  }
  getInformationByNumber = createAsyncThunk<IServiceOfEstation, string>(
    "ServiceOfEstation/getInformationByNumber",

    async (x, info) => {
      return await errorNotification(() => this.service.getInformationByNumber(x), info);
    }
  );
}
export const ServiceOfEstationSliceRequests = new ServiceOfEstationClassSlice(serviceOfEstationService);

const initialState: IIniState<IServiceOfEstation> = {
  loading: null,
  data: null
};

export const serviceOfEstationSlice = createSlice({
  name: "ServiceOfEstation",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ServiceOfEstationSliceRequests.builderAll(builder);
    builder.addCase(ServiceOfEstationSliceRequests.getInformationByNumber.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ServiceOfEstationSliceRequests.getInformationByNumber.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
