import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { InspeccionesGroupedDTO } from "app/features/calidad/services/calidad-inspector-tareas.service";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import {
  CalidadInspeccionesService,
  ICalidadInspecciones,
  ICalidadInspeccionRechazoMultiple
} from "app/features/calidad/services/calidad-inspecciones.service";

const calidadInspeccionesService = new CalidadInspeccionesService();

class CalidadInspeccionesClassSlice extends GenericSlice<ICalidadInspecciones> {
  url = "CalidadInspeccionesService";
  constructor(private service: CalidadInspeccionesService) {
    super("CalidadInspeccionesService", service);
  }

  GetByCodigo = createAsyncThunk<ICalidadInspecciones[], string>(`${this.url}/GetByCodigo`, async (codigo, info) => {
    return await errorNotification(() => this.service.GetByCodigo(codigo), info);
  });

  GetRechazosByInspeccionId = createAsyncThunk<ICalidadInspeccionRechazoMultiple[], number>(
    `${this.url}/GetRechazosByInspeccionId`,
    async (calidadInspeccionesId, info) => {
      return await errorNotification(() => this.service.GetRechazosByInspeccionId(calidadInspeccionesId), info);
    }
  );

  GetInspeccionesGrouped = createAsyncThunk<InspeccionesGroupedDTO[], { from: string; to: string }>(
    `${this.url}/GetInspeccionesGrouped`,
    async (info, thunk) => {
      return await errorNotification(() => this.service.GetInspeccionesGrouped(info.from, info.to), thunk);
    }
  );
}
export const CalidadInspeccionesSliceRequest = new CalidadInspeccionesClassSlice(calidadInspeccionesService);

const initialState: IIniState<ICalidadInspecciones | InspeccionesGroupedDTO | ICalidadInspeccionRechazoMultiple> = {
  loading: null,
  dataAll: [],
  data: null
};

export const CalidadInspectorTareasSlice = createSlice({
  name: "calidadInspecciones",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(CalidadInspeccionesSliceRequest.GetByCodigo.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(CalidadInspeccionesSliceRequest.GetByCodigo.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(CalidadInspeccionesSliceRequest.GetRechazosByInspeccionId.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(CalidadInspeccionesSliceRequest.GetRechazosByInspeccionId.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(CalidadInspeccionesSliceRequest.GetInspeccionesGrouped.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(CalidadInspeccionesSliceRequest.GetInspeccionesGrouped.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
