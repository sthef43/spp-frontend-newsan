import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { InicioHistoryService } from "app/services/inicioHistory.service";
import { IInicioHistory } from "app/models/IInicioHistory";
import { GenericSlice } from "./genericSlice";
//<IAuth, IAuthUser>
const inicioHistoryService = new InicioHistoryService();

class InicioHistoryClassSlice extends GenericSlice<IInicioHistory> {
  constructor(private service: InicioHistoryService) {
    super("InicioHistory", service);
  }
  //Nuevos endpoints que no heredan de generic
  getAllByNroSerie = createAsyncThunk<IInicioHistory[], string>(`Inicio/GetAllByNroSerie`, async (codigo, info) => {
    return await errorNotification(() => this.service.getAllByNroSerie(codigo), info);
  });
  getAllByFechaAndLineaId = createAsyncThunk<IInicioHistory[], { fechaDesde; fechaHasta; codReparacion }>(
    `Inicio/GetAllByFechaAndLineaId`,
    async (params, info) => {
      return await errorNotification(
        () => this.service.getAllByFechaAndLineaId(params.fechaDesde, params.fechaHasta, params.codReparacion),
        info
      );
    }
  );
  getAllByFechaAndModelo = createAsyncThunk<IInicioHistory[], { fechaDesde; fechaHasta; modelo }>(
    `Inicio/GetAllByFechaAndModelo`,
    async (params, info) => {
      return await errorNotification(
        () => this.service.getAllByFechaAndModelo(params.fechaDesde, params.fechaHasta, params.modelo),
        info
      );
    }
  );
}
export const InicioHistorySliceRequests = new InicioHistoryClassSlice(inicioHistoryService);

const initialState: IIniState<IInicioHistory> = {
  loading: null,
  data: null
};

export const InicioHistorySlice = createSlice({
  name: "InicioHistory",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(InicioHistorySliceRequests.getAllByNroSerie.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(InicioHistorySliceRequests.getAllByNroSerie.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(InicioHistorySliceRequests.getAllByFechaAndLineaId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(InicioHistorySliceRequests.getAllByFechaAndLineaId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(InicioHistorySliceRequests.getAllByFechaAndModelo.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(InicioHistorySliceRequests.getAllByFechaAndModelo.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
  }
});
