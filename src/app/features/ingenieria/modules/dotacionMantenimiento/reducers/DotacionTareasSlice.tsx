import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { DatosTareasConResultadosDTO } from "../models/DTOS/DatosTareasConResultadosDTO";
import { IDotacionTareas } from "../models/IDotacionTareas";
import { DotacionTareasService } from "../services/DotacionTareas.service";

const dotacionTareasService = new DotacionTareasService();

class dotacionTareasClassSlice extends GenericSlice<IDotacionTareas> {
  constructor(private service: DotacionTareasService) {
    super("DotacionTareas", service);
  }

  GetAllBySectorId = createAsyncThunk<IDotacionTareas[], number>(
    "DotacionTareas/GetAllBySectorId",
    async (sectorId, info) => {
      return await errorNotification(() => this.service.GetAllBySectorId(sectorId), info);
    }
  );

  GetAllTareasWithValue = createAsyncThunk<DatosTareasConResultadosDTO[], { sectorId; dotacionId; lineaTurnoField }>(
    `DotacionTotales/GetAllTareasWithValue`,
    async ({ sectorId, dotacionId, lineaTurnoField }, info) => {
      return await errorNotification(
        () => this.service.GetAllTareasWithValue(sectorId, dotacionId, lineaTurnoField),
        info
      );
    }
  );
}

export const DotacionTareaSliceRequest = new dotacionTareasClassSlice(dotacionTareasService);

const inititalState: IIniState<IDotacionTareas> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const DotacionTareas = createSlice({
  name: "DotacionTareas",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    DotacionTareaSliceRequest.builderAll(builder);
  }
});
