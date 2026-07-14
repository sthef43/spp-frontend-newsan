import { IAuditRegistry } from "app/models/IAuditRegistry";
import { IIniState } from "app/models/IIniState";
import { AuditRegistryService } from "../services/auditRegistry.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../../../Middleware/HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
const auditRegistryService = new AuditRegistryService();

class AuditRegistryClassSlice extends GenericSlice<IAuditRegistry> {
  constructor(private service: AuditRegistryService) {
    super("AuditRegistry", service);
  }
  getbyRolId = createAsyncThunk<IAuditRegistry[], number>(
    `AuditRegistry/getbyRolId`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.getbyRolId(modelo), info);
    }
  );
  getPaginationbyRolId = createAsyncThunk<IAuditRegistry[], { plantId: number; rolId: number }>(
    `AuditRegistry/getPaginatedbyRolId`,

    async ({ plantId, rolId }, info) => {
      return await errorNotification(() => this.service.getPaginatedbyRolId(plantId, rolId), info);
    }
  );
  GetGraphicByRolAndDates = createAsyncThunk<
    IAuditRegistry[],
    { plantId: number; rolId: number; fechaDesde: string; fechaHasta: string }
  >(
    `AuditRegistry/GetGraphicByRolAndDates`,

    async ({ plantId, rolId, fechaDesde, fechaHasta }, info) => {
      return await errorNotification(
        () => this.service.GetGraphicByRolAndDates(plantId, rolId, fechaDesde, fechaHasta),
        info
      );
    }
  );
  GetAllPaginatedByRolAndDates = createAsyncThunk<
    IAuditRegistry[],
    { plantId: number; rolId: number; fechaDesde: string; fechaHasta: string }
  >(
    `AuditRegistry/GetAllPaginatedByRolAndDates`,

    async ({ plantId, rolId, fechaDesde, fechaHasta }, info) => {
      return await errorNotification(
        () => this.service.GetAllPaginatedByRolAndDates(plantId, rolId, fechaDesde, fechaHasta),
        info
      );
    }
  );
  getAllByIdAndFlag = createAsyncThunk<IAuditRegistry, number>("AuditRegistry/GetAllByIdAndFlag", async (id, info) => {
    return await errorNotification(() => this.service.GetAllByIdAndFlag(id), info);
  });
  canceledRequest = createAsyncThunk<boolean, { id; username }>(
    "AuditRegistry/Canceled",
    async ({ id, username }, info) => {
      return await errorNotification(() => this.service.CanceledRequest(id, username), info);
    }
  );
}
export const AuditRegistrySliceRequests = new AuditRegistryClassSlice(auditRegistryService);

const initialState: IIniState<IAuditRegistry> = {
  loading: null,
  data: null,
  PaginatorData: null,
  object: null
};

export const AuditRegistrySlice = createSlice({
  name: "AuditRegistry",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditRegistrySliceRequests.builderAll(builder);
    builder.addCase(AuditRegistrySliceRequests.getbyRolId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(AuditRegistrySliceRequests.getbyRolId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AuditRegistrySliceRequests.getPaginationbyRolId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(AuditRegistrySliceRequests.getPaginationbyRolId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AuditRegistrySliceRequests.getAllByIdAndFlag.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.object = action.payload;
    });
    builder.addCase(AuditRegistrySliceRequests.getAllByIdAndFlag.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
