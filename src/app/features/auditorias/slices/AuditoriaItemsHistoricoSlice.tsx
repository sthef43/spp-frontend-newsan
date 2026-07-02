import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditoriaItemsHistorico } from "../models/IAuditoriaItemsHistorico";
import { AuditoriaItemsHistoricoService } from "../services/AuditoriaItemsHistorico.service";

const auditoriaItemsHistoricoService = new AuditoriaItemsHistoricoService();

class AuditoriaItemsHistoricoClassSlice extends GenericSlice<IAuditoriaItemsHistorico> {
  constructor(private service: AuditoriaItemsHistoricoService) {
    super("AuditoriaItemsHistorico", service);
  }
}

export const AuditoriaItemsHistoricoSliceRequest = new AuditoriaItemsHistoricoClassSlice(
  auditoriaItemsHistoricoService
);

const inititalState: IIniState<IAuditoriaItemsHistorico> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const AuditoriaItemsHistoricoSlice = createSlice({
  name: "AuditoriaItemsHistorico",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    AuditoriaItemsHistoricoSliceRequest.builderAll(builder);
  }
});
