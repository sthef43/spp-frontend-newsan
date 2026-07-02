import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { SumatoriaFieldTotal } from "../models/DTOS/SumatoriaFieldTotal";
import { IDotacionTareasResultados } from "../models/IDotacionTareasResultados";
import { DotacionTareasResultadosService } from "../services/DotacionTareasResultados.service";

const dotacionTareasResultadosService = new DotacionTareasResultadosService();

class DotacionTareasResultadosClassSlice extends GenericSlice<IDotacionTareasResultados> {
  constructor(private service: DotacionTareasResultadosService) {
    super("DotacionTareasResultados", service);
  }

  GetAllTasksByDotacionId = createAsyncThunk<IDotacionTareasResultados[], { dotacionId; sectorId; lineaTurnoField }>(
    "DotacionTareas/GetAllTasksByDotacionId",
    async ({ dotacionId, sectorId, lineaTurnoField }, info) => {
      return await errorNotification(
        () => this.service.GetAllTasksByDotacionId(dotacionId, sectorId, lineaTurnoField),
        info
      );
    }
  );

  GetTotalValuesOfTasks = createAsyncThunk<SumatoriaFieldTotal, { dotacionId; lineaTurnoField }>(
    `DotacionTareasResultados/GetTotalValuesOfTasks`,
    async ({ dotacionId, lineaTurnoField }, info) => {
      return await errorNotification(() => this.service.GetTotalValuesOfTasks(dotacionId, lineaTurnoField), info);
    }
  );
}

export const DotacionTareasResultadosSliceRequest = new DotacionTareasResultadosClassSlice(
  dotacionTareasResultadosService
);

const inititalState: IIniState<IDotacionTareasResultados> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const DotacionTareasResultados = createSlice({
  name: "DotacionTareasResultados",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    DotacionTareasResultadosSliceRequest.builderAll(builder);
  }
});
