import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditoriaGrupoItemsBloq } from "../models/IAuditoriaGrupoItemsBloq";
import { AuditoriaGrupoItemsBloqService } from "../services/AuditoriaGrupoItemsBloq.service";

const service = new AuditoriaGrupoItemsBloqService();

class AuditoriaGrupoItemsBloqClassSlice extends GenericSlice<IAuditoriaGrupoItemsBloq> {
  constructor(service: AuditoriaGrupoItemsBloqService) {
    super("AuditoriaGrupoItemsBloq", service);
  }
}

export const AuditoriaGrupoItemsBloqSliceRequest = new AuditoriaGrupoItemsBloqClassSlice(service);

const initialState: IIniState<IAuditoriaGrupoItemsBloq> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const auditoriaGrupoItemsBloqSlice = createSlice({
  name: "AuditoriaGrupoItemsBloq",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditoriaGrupoItemsBloqSliceRequest.builderAll(builder);
  }
});
