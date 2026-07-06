import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { ICalidadInspectorTareas } from "app/models/ICalidadInspectorTareas";
import { CalidadInspectorTareasService } from "app/features/calidad/services/calidad-inspector-tareas.service";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const calidadInspectorTareasService = new CalidadInspectorTareasService();

class CalidadInspectorTareasClassSlice extends GenericSlice<ICalidadInspectorTareas> {
  url = "CalidadInspectorTareas";
  constructor(private service: CalidadInspectorTareasService) {
    super("CalidadInspectorTareas", service);
  }
  //Nuevos endpoints que no heredan de
  GetTareasByInspectorId = createAsyncThunk<ICalidadInspectorTareas[], number>(
    `${this.url}/GetTareas`,
    async (inspectorId, info) => {
      return await errorNotification(() => this.service.GetTareasByInspectorId(inspectorId), info);
    }
  );
}
export const CalidadInspectorTareasSliceRequest = new CalidadInspectorTareasClassSlice(calidadInspectorTareasService);

const initialState: IIniState<ICalidadInspectorTareas> = {
  loading: null,
  dataAll: [],
  data: null
};

export const CalidadInspectorTareasSlice = createSlice({
  name: "calidadInspeccionTarea",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(CalidadInspectorTareasSliceRequest.GetTareasByInspectorId.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(CalidadInspectorTareasSliceRequest.GetTareasByInspectorId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
