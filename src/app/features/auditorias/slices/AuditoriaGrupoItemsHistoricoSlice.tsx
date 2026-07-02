import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditoriaGrupoItemsHistorico } from "../models/IAuditoriaGrupoItemsHistorico";
import { AuditoriaGrupoItemsHistoricoService } from "../services/AuditoriaGrupoItemsHistorico.service";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const auditoriaGrupoItemsHistoricoService = new AuditoriaGrupoItemsHistoricoService();

class AuditoriaGrupoItemsHistoricoClassSlice extends GenericSlice<IAuditoriaGrupoItemsHistorico> {
  constructor(private service: AuditoriaGrupoItemsHistoricoService) {
    super("AuditoriaGrupoItemsHistorico", service);
  }

  MultiPostWithImages = createAsyncThunk<
    boolean,
    { auditoriaHistoricoId: number; idsGrupos: number[]; listaArchivos: File[] }
  >(
    `AuditoriaGrupoItemsHistorico/MultiPostWithImages`,
    async ({ auditoriaHistoricoId, idsGrupos, listaArchivos }, info) => {
      return await errorNotification(
        () => this.service.MultiPostWithImages(auditoriaHistoricoId, idsGrupos, listaArchivos),
        info
      );
    }
  );

  MultiPostReturnList = createAsyncThunk<IAuditoriaGrupoItemsHistorico[], IAuditoriaGrupoItemsHistorico[]>(
    `AuditoriaGrupoItemsHistorico/MultiPostReturnList`,
    async (entidad, info) => {
      return await errorNotification(() => this.service.MultiPostReturnList(entidad), info);
    }
  );
}

export const AuditoriaGrupoItemsHistoricoSliceRequest = new AuditoriaGrupoItemsHistoricoClassSlice(
  auditoriaGrupoItemsHistoricoService
);

const inititalState: IIniState<IAuditoriaGrupoItemsHistorico> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const AuditoriaGrupoItemsHistoricoSlice = createSlice({
  name: "AuditoriaGrupoItemsHistorico",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    AuditoriaGrupoItemsHistoricoSliceRequest.builderAll(builder);
  }
});
