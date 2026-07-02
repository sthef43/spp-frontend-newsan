import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditoriaListaValoresResult } from "../models/IAuditoriaListaValoresResult";
import { AuditoriaListaValoresResultService } from "../services/AuditoriaListaValoresResult.service";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const auditoriaListaValoresResultService = new AuditoriaListaValoresResultService();

class AuditoriaListaValoresResultClassSlice extends GenericSlice<IAuditoriaListaValoresResult> {
  constructor(private service: AuditoriaListaValoresResultService) {
    super("AuditoriaListaValoresResult", service);
  }

  GetAllAuditsByRolId = createAsyncThunk<IAuditoriaListaValoresResult[], number>(
    `AuditoriaListaValoresResult/GetAllAuditsByRolId`,
    async (idRol: number, info) => {
      return await errorNotification(() => this.service.GetAllAuditsByRolId(idRol), info);
    }
  );

  GetAllListValuesByAuditId = createAsyncThunk<IAuditoriaListaValoresResult, number>(
    `AuditoriaListaValoresResult/GetAllListValuesByAuditId`,
    async (idAudit: number, info) => {
      return await errorNotification(() => this.service.GetAllListValuesByAuditId(idAudit), info);
    }
  );
}

export const AuditoriaListaValoresResultSliceRequest = new AuditoriaListaValoresResultClassSlice(
  auditoriaListaValoresResultService
);

const inititalState: IIniState<IAuditoriaListaValoresResult> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const AuditoriaListaValoresResultSlice = createSlice({
  name: "AuditoriaListaValoresPadre",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    AuditoriaListaValoresResultSliceRequest.builderAll(builder);
  }
});
