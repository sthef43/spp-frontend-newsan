import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditoriaGrupoItemsResult } from "../models/IAuditoriaGrupoItemsResult";
import { AuditoriaGrupoItemsResultService } from "../services/AuditoriaGrupoItemsResult.service";

const auditoriaGrupoItemsResultService = new AuditoriaGrupoItemsResultService();

class AuditoriaGrupoItemsResultClassSlice extends GenericSlice<IAuditoriaGrupoItemsResult> {
  constructor(private service: AuditoriaGrupoItemsResultService) {
    super("AuditoriaGrupoItemsResult", service);
  }

  GetAllGroupResultsByAuditId = createAsyncThunk<IAuditoriaGrupoItemsResult[], number>(
    "AuditoriaGrupoItemsResult/GetAllGroupResultsByAuditId",
    async (auditoriaId) => {
      return await this.service.GetAllGroupResultsByAuditId(auditoriaId);
    }
  );
}

export const AuditoriaGrupoItemsResultSliceRequest = new AuditoriaGrupoItemsResultClassSlice(
  auditoriaGrupoItemsResultService
);

const inititalState: IIniState<IAuditoriaGrupoItemsResult> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const AuditoriaGrupoItemsResultSlice = createSlice({
  name: "AuditoriaGrupoItemsResult",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    AuditoriaGrupoItemsResultSliceRequest.builderAll(builder);
  }
});
