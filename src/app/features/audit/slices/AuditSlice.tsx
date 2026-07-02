import { IAudit } from "app/models/IAudit";
import { IIniState } from "app/models/IIniState";
import { AuditService } from "app/services/audit.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
import { errorNotification } from "../../../Middleware/HelperMidleware/errorNotifications";
const auditService = new AuditService();
class auditClassSlice extends GenericSlice<IAudit> {
  constructor(private service: AuditService) {
    super("Audit", service);
  }
  //nuevos asyncthunks aqui
  getAllByPlantIdAndRolRequest = createAsyncThunk<IAudit[], { plantId; rolId }>(
    `Audit/GetAllByPlantIdAndRol`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.getAllByPlantIdAndRol(modelo), info);
    }
  );
}
export const AuditSliceRequests = new auditClassSlice(auditService);

const initialState: IIniState<IAudit> = {
  loading: null,
  data: null
};

export const auditSlice = createSlice({
  name: "Audit",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(AuditSliceRequests.getAllByPlantIdAndRolRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(AuditSliceRequests.getAllByPlantIdAndRolRequest.rejected, (state, _) => {
      state.loading = "rejected";
    });
  }
});
