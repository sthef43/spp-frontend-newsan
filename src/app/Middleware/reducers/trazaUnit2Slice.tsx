import { createAsyncThunk } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { TrazaUnit2Service } from "app/services/trazaUnit2.service";
import { ITrazaUnit } from "app/models/ITrazaUnit";
import { IEMPQDeclarations } from "app/models/IEMPQDeclarations";
import { ReporteProduccionAutomotriz } from "app/models/Stored Procdure/ReporteProduccionAutomotriz";

const trazaUnit2Service = new TrazaUnit2Service();

class trazaUnit2ClassSlice extends GenericSlice<ITrazaUnit> {
  constructor(private service: TrazaUnit2Service) {
    super("TrazaUnit2", service);
  }
  //nuevos asyncthunks aqui
  getByCodigo = createAsyncThunk<ITrazaUnit, string>(`TrazaUnit2/GetByCodigo`, async (modelo, info) => {
    return await errorNotification(() => this.service.getByCodigo(modelo), info);
  });

  getAllByCodigo = createAsyncThunk<boolean, IEMPQDeclarations[]>(`TrazaUnit2/GetAllByCodigo`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllByCodigo(modelo), info);
  });

  actualizarRequest = createAsyncThunk<boolean, { codigo: string; rechazado: boolean }>(
    `TrazaUnit2/ActualizarRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.ActualizarRequest(modelo), info);
    }
  );

  DischargeAllPlates = createAsyncThunk<boolean, ITrazaUnit[]>(
    `TrazaUnit2/DischargeAllPlates`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.DischargeAllPlates(modelo), info);
    }
  );

  getAllPlatesRejected = createAsyncThunk<ITrazaUnit[], void>(`TrazaUnit2/GetAllPlatesRejected`, async (_, info) => {
    return await errorNotification(() => this.service.GetAllPlatesRejected(), info);
  });

  GetAllPLatesRejectedByDates = createAsyncThunk<ITrazaUnit[], { fechaDesde: string; fechaHasta: string }>(
    `/GetAllPLatesRejectedByDates`,
    async ({ fechaDesde, fechaHasta }, info) => {
      return await errorNotification(() => this.service.GetAllPLatesRejectedByDates(fechaDesde, fechaHasta), info);
    }
  );

  getReportProductionByPosition = createAsyncThunk<ReporteProduccionAutomotriz[], void>(
    `TrazaUnit2/GetReportProductionByPosition`,
    async (_, info) => {
      return await errorNotification(() => this.service.GetReportProductionByPosition(), info);
    }
  );
}
export const TrazaUnit2SliceRequest = new trazaUnit2ClassSlice(trazaUnit2Service);

/* const initialState: IIniState<IMapasRutasCampos> = {
  loading: null,
  data: null,
  dataAll: []
};

export const mapasRutasCamposSlice = createSlice({
  name: "mapasRutasCampos",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    MapasRutasCamposSliceRequest.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(MapasRutasCamposSliceRequest.getListByMapaRutaId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(MapasRutasCamposSliceRequest.getListByMapaRutaId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
}); */
