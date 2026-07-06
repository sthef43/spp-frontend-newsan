import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { SubirImagenesAuditHistoricoDTO } from "app/models/DTO/SubirImagenesAuditHistoricoDTO";
import { IAuditImagenesHistorico } from "../../../models/IAuditImagenesHistorico";
import { AuditImagenesHistoricoService } from "../services/auditImagenesHistorico.service";
import { errorNotification } from "../../../Middleware/HelperMidleware/errorNotifications";

const auditImagenesHistoricoService = new AuditImagenesHistoricoService();

class AuditImagenesHistoricoClassSlice extends GenericSlice<IAuditImagenesHistorico> {
  constructor(private service: AuditImagenesHistoricoService) {
    super("AuditImagenesHistorico", service);
  }

  UploadMultiImages = createAsyncThunk<boolean, SubirImagenesAuditHistoricoDTO>(
    `AuditImagenesHistorico/UploadMultiImages`,
    async (state, info) => {
      return await errorNotification(() => this.service.UploadMultiImages(state), info);
    }
  );
}

export const AuditImagenesHistoricoSliceRequest = new AuditImagenesHistoricoClassSlice(auditImagenesHistoricoService);

const inititalState: IIniState<IAuditImagenesHistorico> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const AuditImagenesHistoricoSlice = createSlice({
  name: "AuditImagenesHistorico",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    AuditImagenesHistoricoSliceRequest.builderAll(builder);
  }
});
