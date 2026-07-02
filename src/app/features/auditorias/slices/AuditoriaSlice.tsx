import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditoria } from "../models/IAuditoria";
import { AuditoriaService } from "../services/Auditoria.service";
import { AuditoriaEntidadesDTO } from "../models/DTO/AuditoriaEntidadesDTO";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const auditoriaService = new AuditoriaService();

class AuditoriaClassSlice extends GenericSlice<IAuditoria> {
  constructor(private service: AuditoriaService) {
    super("Auditoria", service);
  }

  createAuditWithResults = createAsyncThunk(
    "Auditoria/createAuditWithResults",
    async (entidades: AuditoriaEntidadesDTO) => {
      return await this.service.CreateAuditWithResults(entidades);
    }
  );

  GetAllAuditsFatherByRolAndPlantId = createAsyncThunk<IAuditoria[], { idPlant; idRol }>(
    `Auditoria/GetAllAuditsFatherByRolAndPlantId`,
    async ({ idPlant, idRol }, info) => {
      return await errorNotification(() => this.service.GetAllAuditsFatherByRolAndPlantId(idPlant, idRol), info);
    }
  );

  GetAllAuditsByRolAndPlantId = createAsyncThunk<IAuditoria[], { idPlant; idRol }>(
    `Auditoria/GetAllAuditsByRolAndPlantId`,
    async ({ idPlant, idRol }, info) => {
      return await errorNotification(() => this.service.GetAllAuditsByRolAndPlantId(idPlant, idRol), info);
    }
  );
}

export const AuditoriaSliceRequest = new AuditoriaClassSlice(auditoriaService);

const initialState: IIniState<IAuditoria> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const auditoriaSlice = createSlice({
  name: "Auditoria",
  initialState: initialState,
  reducers: {
    setListaAuditorias: (state, action: PayloadAction<IAuditoria[]>) => {
      state.dataAll = action.payload;
    }
  },
  extraReducers: (builder) => {
    AuditoriaSliceRequest.builderAll(builder);
    builder.addCase(AuditoriaSliceRequest.GetAllAuditsByRolAndPlantId.rejected, (state, _) => {
      state.loading = "rejected";
    });
    builder.addCase(AuditoriaSliceRequest.GetAllAuditsByRolAndPlantId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
  }
});
