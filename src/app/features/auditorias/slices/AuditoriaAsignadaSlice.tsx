/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditoriaAsignada } from "../models/IAuditoriaAsignada";
import { AuditoriaAsignadaService } from "../services/AuditoriaAsignada.service";
import { AuditoriaEditDTO, AuditoriaEntidadesDTO } from "../models/DTO/AuditoriaEntidadesDTO";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const service = new AuditoriaAsignadaService();

class AuditoriaAsignadaClassSlice extends GenericSlice<IAuditoriaAsignada> {
  constructor(private service: AuditoriaAsignadaService) {
    super("AuditoriaAsignada", service);
  }

  createAuditWithResults = createAsyncThunk<IAuditoriaAsignada, AuditoriaEntidadesDTO>(
    `AuditoriaAsignada/createAuditWithResults`,
    async (entidades, info) => {
      return await errorNotification(() => this.service.CreateAuditWithResults(entidades), info);
    }
  );

  updateAuditWithResults = createAsyncThunk<IAuditoriaAsignada, AuditoriaEditDTO>(
    `AuditoriaAsignada/updateAuditWithResults`,
    async (entidades, info) => {
      return await errorNotification(() => this.service.UpdateAuditWithResults(entidades), info);
    }
  );

  getAllAuditsOfTheDay = createAsyncThunk<
    IAuditoriaAsignada[],
    { rolId: number; subRolId: number; turnoId: number; plantId: number }
  >(`AuditoriaAsignada/getAllAuditsOfTheDay`, async ({ rolId, subRolId, turnoId, plantId }, info) => {
    return await errorNotification(() => this.service.GetAllAuditsOfTheDay(rolId, subRolId, turnoId, plantId), info);
  });

  getAuditResultWithAllDatesById = createAsyncThunk<IAuditoriaAsignada, number>(
    `AuditoriaAsignada/getAuditResultWithAllDatesById`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAuditResultWithAllDatesById(id), info);
    }
  );

  getAuditResultWithAllDatesByAuditAsignadaId = createAsyncThunk<IAuditoriaAsignada, number>(
    `AuditoriaAsignada/getAuditResultWithAllDatesByAuditAsignadaId`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAuditResultWithAllDatesByAuditAsignadaId(id), info);
    }
  );

  getAllAuditAsignedByAuditId = createAsyncThunk<IAuditoriaAsignada[], number>(
    `AuditoriaAsignada/getAllAuditAsignedByAuditId`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAllAuditAsignedByAuditId(id), info);
    }
  );
}

export const AuditoriaAsignadaSliceRequest = new AuditoriaAsignadaClassSlice(service);

const initialState: IIniState<IAuditoriaAsignada> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const auditoriaAsignadaSlice = createSlice({
  name: "AuditoriaAsignada",
  initialState: initialState,
  reducers: {
    setAuditoria: (state, action) => {
      state.data = action.payload;
    }
  },
  extraReducers: (builder) => {
    AuditoriaAsignadaSliceRequest.builderAll(builder);
    builder.addCase(AuditoriaAsignadaSliceRequest.getAuditResultWithAllDatesById.rejected, (state, _) => {
      state.loading = "rejected";
    });
    builder.addCase(AuditoriaAsignadaSliceRequest.getAuditResultWithAllDatesById.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
  }
});
