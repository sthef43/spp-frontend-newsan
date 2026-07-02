import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditoriaGrupoMails } from "../models/IAuditoriaGrupoMails";
import { AuditoriaGrupoMailsService } from "../services/AuditoriaGrupoMails.service";

const service = new AuditoriaGrupoMailsService();

class AuditoriaGrupoMailsClassSlice extends GenericSlice<IAuditoriaGrupoMails> {
  constructor(service: AuditoriaGrupoMailsService) {
    super("AuditoriaGrupoMails", service);
  }
}

export const AuditoriaGrupoMailsSliceRequest = new AuditoriaGrupoMailsClassSlice(service);

const initialState: IIniState<IAuditoriaGrupoMails> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const auditoriaGrupoMailsSlice = createSlice({
  name: "AuditoriaGrupoMails",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditoriaGrupoMailsSliceRequest.builderAll(builder);
  }
});
