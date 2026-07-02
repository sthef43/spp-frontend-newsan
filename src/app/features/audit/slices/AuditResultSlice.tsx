import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditHistorico } from "../../../models/IAuditHistorico";
import { AuditHistoricoService } from "../../../services/auditHistorico.service";

const auditHistoricoService = new AuditHistoricoService();

class AuditHistoricoClassSlice extends GenericSlice<IAuditHistorico> {
  constructor(private service: AuditHistoricoService) {
    super("AuditHistorico", service);
  }
}

export const AuditHistoricoSliceRequest = new AuditHistoricoClassSlice(auditHistoricoService);

const inititalState: IIniState<IAuditHistorico> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const AuditHistoricoSlice = createSlice({
  name: "AuditHistorico",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    AuditHistoricoSliceRequest.builderAll(builder);
  }
});
