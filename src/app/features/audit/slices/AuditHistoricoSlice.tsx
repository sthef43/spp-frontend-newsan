import { IAuditHistorico } from "app/models/IAuditHistorico";
import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { AuditHistoricoService } from "../services/auditHistorico.service";

const auditHistoricoService = new AuditHistoricoService();

class AuditHistoricoClassSlice extends GenericSlice<IAuditHistorico> {
  constructor(private service: AuditHistoricoService) {
    super("AuditHistorico", service);
  }
  GetAllAuditHistoricsByPlantRolDatesAndLineId = createAsyncThunk<
    IAuditHistorico[],
    { plantId: number; rolId: number; lineId: number; tipoMuestra: string; fechaDesde: string; fechaHasta: string }
  >(`AuditHistorico/GetAllAuditHistoricsByPlantRolDatesAndLineId`, async ({ plantId, rolId, lineId, tipoMuestra, fechaDesde, fechaHasta }, info) => {
    return await errorNotification(
      () => this.service.GetAllAuditHistoricsByPlantRolDatesAndLineId(plantId, rolId, lineId, tipoMuestra, fechaDesde, fechaHasta),
      info
    );
  });

}
export const AuditHistoricoSliceRequests = new AuditHistoricoClassSlice(auditHistoricoService);

const initialState: IIniState<IAuditHistorico> = {
  loading: null,
  data: null,
  PaginatorData: null,
  object: null
};

export const AuditHistoricoSlice = createSlice({
  name: "AuditHistorico",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditHistoricoSliceRequests.builderAll(builder);
    builder.addCase(AuditHistoricoSliceRequests.GetAllAuditHistoricsByPlantRolDatesAndLineId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(AuditHistoricoSliceRequests.GetAllAuditHistoricsByPlantRolDatesAndLineId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
