import { IAuditRegistryResult } from "app/models/IAuditRegistryResult";
import { IIniState } from "app/models/IIniState";
import { AuditRegistryResultService } from "../services/auditRegistryResult.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
import { errorNotification } from "../../../Middleware/HelperMidleware/errorNotifications";
const auditRegistryResultService = new AuditRegistryResultService();

class AuditRegistryResultClassSlice extends GenericSlice<IAuditRegistryResult> {
  constructor(private service: AuditRegistryResultService) {
    super("Users", service);
  }
  getAllByIdAndFlag = createAsyncThunk<IAuditRegistryResult, number>(
    "AuditRegistryResult/GetAllById",
    async (id, info) => {
      return await errorNotification(() => this.service.GetAllByIdAndFlag(id), info);
    }
  );
  setResolverRequest = createAsyncThunk<IAuditRegistryResult, number>(
    "AuditRegistryResult/SetReolver",
    async (id, info) => {
      return await errorNotification(() => this.service.SetResolver(id), info);
    }
  );
}
export const AuditRegistryResultSliceRequests = new AuditRegistryResultClassSlice(auditRegistryResultService);

const initialState: IIniState<IAuditRegistryResult> = {
  loading: null,
  data: null,
  object: null
};

export const AuditRegistryResultSlice = createSlice({
  name: "AuditRegistryResult",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditRegistryResultSliceRequests.builderAll(builder);
    builder.addCase(AuditRegistryResultSliceRequests.getAllByIdAndFlag.fulfilled, (state, action) => {
      state.object = action.payload;
      state.loading = "fulfilled";
    });
    builder.addCase(AuditRegistryResultSliceRequests.getAllByIdAndFlag.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AuditRegistryResultSliceRequests.setResolverRequest.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = "fulfilled";
    });
    builder.addCase(AuditRegistryResultSliceRequests.setResolverRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
