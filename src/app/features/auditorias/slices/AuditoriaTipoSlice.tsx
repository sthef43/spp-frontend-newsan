import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditoriaTipo } from "../models/IAuditoriaTipo";
import { AuditoriaTipoService } from "../services/AuditoriaTipo.service";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const service = new AuditoriaTipoService();

class AuditoriaTipoClassSlice extends GenericSlice<IAuditoriaTipo> {
  constructor(private service: AuditoriaTipoService) {
    super("AuditoriaTipo", service);
  }

  GetTiposByRolId = createAsyncThunk<IAuditoriaTipo[], number>(
    `AuditoriaTipo/GetTiposByRolId`,
    async (rolId, info) => {
      return await errorNotification(() => this.service.GetTiposByRolId(rolId), info);
    }
  );

  GetTiposByRolAndPlantId = createAsyncThunk<IAuditoriaTipo[], { rolId: number; plantId: number }>(
    `AuditoriaTipo/GetTiposByRolAndPlantId`,
    async ({ rolId, plantId }, info) => {
      return await errorNotification(() => this.service.GetTiposByRolAndPlantId(rolId, plantId), info);
    }
  );
}

export const AuditoriaTipoSliceRequest = new AuditoriaTipoClassSlice(service);

const initialState: IIniState<IAuditoriaTipo> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const auditoriaTipoSlice = createSlice({
  name: "AuditoriaTipo",
  initialState: initialState,
  reducers: {
    setListaTipos(state, action) {
      state.dataAll = action.payload;
    }
  },
  extraReducers: (builder) => {
    AuditoriaTipoSliceRequest.builderAll(builder);
    builder.addCase(AuditoriaTipoSliceRequest.GetTiposByRolId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(AuditoriaTipoSliceRequest.GetTiposByRolId.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(AuditoriaTipoSliceRequest.GetTiposByRolId.pending, (state, _action) => {
      state.loading = "pending";
    });
    builder.addCase(AuditoriaTipoSliceRequest.GetTiposByRolAndPlantId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(AuditoriaTipoSliceRequest.GetTiposByRolAndPlantId.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(AuditoriaTipoSliceRequest.GetTiposByRolAndPlantId.pending, (state, _action) => {
      state.loading = "pending";
    });
  }
});
