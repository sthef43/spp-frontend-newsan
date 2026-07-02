import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { TrazaUnit_History2Service } from "app/services/trazaUnit_History2.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { TrazaUnit_History } from "app/models/ITrazaUnit_History";
import { ITableroStock } from "app/models/ITableroStock";
import { ITGroupResult } from "app/models/ITGroupResult";

const trazaUnit_History2Service = new TrazaUnit_History2Service();
class trazaunit_History2ClassSlice extends GenericSlice<TrazaUnit_History> {
  constructor(private service: TrazaUnit_History2Service) {
    super("TrazaUnit_History2", service);
  }
  //nuevos asyncthunks aqui
  getListByLineaPuestoAndFechaAndHora = createAsyncThunk<
    TrazaUnit_History[],
    { lineaPuestoId: number; fecha: string; horaDesde: number; horaHasta: number }
  >(`TrazaUnit_History2/getListByLineaPuestoAndFechaAndHora`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetListByLineaPuestoAndFechaAndHora(modelo), info);
  });
  GetListByLineaPuesto = createAsyncThunk<TrazaUnit_History[], { lineaPuestoId; fecha; horaDesde; horaHasta }>(
    `TrazaUnit_History2/GetListByLineaPuesto`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByLineaPuesto(modelo), info);
    }
  );
  GetListByLineaTurno = createAsyncThunk<ITGroupResult[], { lineaProduccionId; fecha; horaDesde; horaHasta }>(
    `TrazaUnit_History2/GetListByLineaTurno`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByLineaTurno(modelo), info);
    }
  );

  GetListPuestosAndCantidad = createAsyncThunk<TrazaUnit_History[], { listLineaPuestoId; fecha; horaDesde; horaHasta }>(
    `TrazaUnit_History2/GetListPuestosAndCantidad`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListPuestosAndCantidad(modelo), info);
    }
  );
  GetListPuestosAndCantidadByFamilia = createAsyncThunk<
    TrazaUnit_History[],
    { listLineaPuestoId; fecha; horaDesde; horaHasta }
  >(`TrazaUnit_History2/GetListPuestosAndCantidadByFamilia`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetListPuestosAndCantidadByFamilia(modelo), info);
  });
  getProduccidoTodayByLineaPuesto = createAsyncThunk<number, number>(
    `TrazaUnit_History2/GetProduccidoTodayByLineaPuesto`,
    async (lineaPuestoId, info) => {
      return await errorNotification(() => this.service.GetProduccidoTodayByLineaPuesto(lineaPuestoId), info);
    }
  );
  getAllByFechaAndTurnoAndOthers = createAsyncThunk<TrazaUnit_History[], { fecha; idHora; puestoLineaId }>(
    `TrazaUnit_History2/getAllByFechaAndTurnoAndCodigoInicio`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetAllByFechaAndTurnoAndOthers(modelo), info);
    }
  );
  getProduccidoPorFamiliaTodayByLineaPuesto = createAsyncThunk<Array<{ familia: string; cantidad: number }>, number>(
    `TrazaUnit_History2/getAllByFechaAndTurnoAndCodigoInicio`,
    async (lineaPuestoId, info) => {
      return await errorNotification(() => this.service.getProduccidoPorFamiliaTodayByLineaPuesto(lineaPuestoId), info);
    }
  );
  getGNGPorFamiliaTodayByLineaPuesto = createAsyncThunk<ITableroStock[], { lineaPuestoId; lineaId; nombrePuesto }>(
    `TrazaUnit_History2/getAllByFechaAndTurnoAndCodigoInicio`,
    async ({ lineaPuestoId, lineaId, nombrePuesto }, info) => {
      return await errorNotification(
        () => this.service.GetGNGPorFamiliaTodayByLineaPuesto(lineaPuestoId, lineaId, nombrePuesto),
        info
      );
    }
  );

  getProduccionByModelo = createAsyncThunk<
    Array<{ lineaPuestoId: number; cantidad: number; familia: string; hora: number }>,
    { lineaProduccionId; desde; hasta }
  >(`TrazaUnit_History2/GetProduccionByModelo`, async ({ lineaProduccionId, desde, hasta }, info) => {
    return await errorNotification(() => this.service.GetProduccionByModelo(lineaProduccionId, desde, hasta), info);
  });

  getProduccionAmountByDates = createAsyncThunk<
    Array<{ lineaPuestoId: number; cantidad: number; fecha: string }>,
    { lineaProduccionId; fechaDesde; fechaHasta; desde; hasta }
  >(
    `TrazaUnit_History2/GetProduccionAmountByDates`,
    async ({ lineaProduccionId, fechaDesde, fechaHasta, desde, hasta }, info) => {
      return await errorNotification(
        () => this.service.GetProduccionAmountByDates(lineaProduccionId, fechaDesde, fechaHasta, desde, hasta),
        info
      );
    }
  );

  GetAllRouteOfTraceWithId = createAsyncThunk<TrazaUnit_History[], number>(
    `TrazaUnit_History2/GetAllRouteOfTraceWithId`, async (trazaOperacionesId, info) => {
      return await errorNotification(() => this.service.GetAllRouteOfTraceWithId(trazaOperacionesId), info)
    }
  )
}
export const TrazaUnit_History2SliceRequests = new trazaunit_History2ClassSlice(trazaUnit_History2Service);

const initialState: IIniState<TrazaUnit_History> = {
  loading: null,
  data: null,
  dataAll: []
};

export const TrazaUnit_History2Slice = createSlice({
  name: "TrazaUnit_History2",
  initialState: initialState,
  reducers: {
    setRecorridoPlaca: (state, action: PayloadAction<TrazaUnit_History[]>) => {
      state.dataAll = action.payload
    }
  },
  extraReducers: (builder) => {
    /*     ResultsTimesSliceRequests.builderAll(builder);
     */
    //nuevos manejos de asyncthunk aqui
  }
});
