import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditValoresResult } from "../../../models/IAuditValoresResult";
import { AuditValoresResultService } from "../../../services/auditValoresResult.service";

const auditValoresResultService = new AuditValoresResultService();

class AuditValoresResultClassSlice extends GenericSlice<IAuditValoresResult> {
  constructor(private service: AuditValoresResultService) {
    super("AuditValoresResult", service);
  }
}

export const AuditValoresResultSliceRequest = new AuditValoresResultClassSlice(auditValoresResultService);

const inititalState: IIniState<IAuditValoresResult> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const AuditValoresResultSlice = createSlice({
  name: "AuditValoresResult",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    AuditValoresResultSliceRequest.builderAll(builder);
  }
});
