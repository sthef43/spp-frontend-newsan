import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditoriasHistorico } from "../models/IAuditoriasHistorico";
import { AuditoriasHistoricoService } from "../services/AuditoriasHistorico.service";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const auditoriasHistoricoService = new AuditoriasHistoricoService();

class AuditoriasHistoricoClassSlice extends GenericSlice<IAuditoriasHistorico> {
  constructor(private service: AuditoriasHistoricoService) {
    super("AuditoriasHistorico", service);
  }

  GetAllAuditsByPlantId = createAsyncThunk<
    IAuditoriasHistorico[],
    { plantaId: number; fechaDesde: string; fechaHasta: string }
  >(`AuditoriasHistorico/GetAllAuditsByPlantId`, async ({ plantaId, fechaDesde, fechaHasta }, info) => {
    return await errorNotification(() => this.service.GetAllAuditsByPlantId(plantaId, fechaDesde, fechaHasta), info);
  });

  GetAuditById = createAsyncThunk<IAuditoriasHistorico, number>(
    `AuditoriasHistorico/GetAuditById`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAuditById(id), info);
    }
  );
}

export const AuditoriasHistoricoSliceRequest = new AuditoriasHistoricoClassSlice(auditoriasHistoricoService);

const inititalState: IIniState<IAuditoriasHistorico> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const AuditoriasHistoricoSlice = createSlice({
  name: "AuditoriasHistorico",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    AuditoriasHistoricoSliceRequest.builderAll(builder);
  }
});
