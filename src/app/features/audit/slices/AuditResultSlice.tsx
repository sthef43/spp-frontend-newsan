import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditHistorico } from "../../../models/IAuditHistorico";
import { AuditHistoricoService } from "../services/auditHistorico.service";

const auditResultService = new AuditHistoricoService();

class AuditResultClassSlice extends GenericSlice<IAuditHistorico> {
  constructor(private service: AuditHistoricoService) {
    super("AuditHistorico", service);
  }
}

export const AuditResultSliceRequest = new AuditResultClassSlice(auditResultService);

const inititalState: IIniState<IAuditHistorico> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const AuditResultSlice = createSlice({
  name: "AuditResult",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    AuditResultSliceRequest.builderAll(builder);
  }
});
