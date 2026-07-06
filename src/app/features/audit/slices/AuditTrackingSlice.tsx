import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models";
import { IAuditTracking } from "app/models/IAuditTracking";
import { AuditTrackingService } from "../services/auditTracking.service";
import { errorNotification } from "../../../Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";

const auditTrackingService = new AuditTrackingService();
class auditTrackingClassSlice extends GenericSlice<IAuditTracking> {
  constructor(private service: AuditTrackingService) {
    super("AuditTracking", service);
  }
  getAllByARIdRequest = createAsyncThunk<IAuditTracking[], number>("AuditTracking/GetAllByARId", async (id, info) => {
    return await errorNotification(() => this.service.GetAllByARId(id), info);
  });
  getAllByRolIdRequest = createAsyncThunk<IAuditTracking[], number>("AuditTracking/GetAllByRolId", async (id, info) => {
    return await errorNotification(() => this.service.GetAllByRolId(id), info);
  });
}
export const AuditTrackingSliceRequest = new auditTrackingClassSlice(auditTrackingService);
const initialState: IIniState<IAuditTracking> = {
  dataAll: [],
  data: null,
  object: null,
  loading: "",
  PaginatorData: null
};
export const AuditTrackingSlice = createSlice({
  name: "AuditTracking",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditTrackingSliceRequest.builderAll(builder);
    builder.addCase(AuditTrackingSliceRequest.getAllByARIdRequest.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fulfilled";
    });
    builder.addCase(AuditTrackingSliceRequest.getAllByARIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AuditTrackingSliceRequest.getAllByRolIdRequest.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fulfilled";
    });
    builder.addCase(AuditTrackingSliceRequest.getAllByRolIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
