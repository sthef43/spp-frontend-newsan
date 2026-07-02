import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { PeriodoLineaService } from "app/services/periodoLinea.service";
import { IPeriodoLinea } from "app/models/IPeriodoLinea";
//<IAuth, IAuthUser>
const periodoLineaService = new PeriodoLineaService();
/* 
interface propsReporte {
  planProd: IPlanProd[];
  fechaDesde: string;
  fechaHasta: string;
} */

class PeriodoLineaClassSlice {
  constructor(private service: PeriodoLineaService) {}
  //Nuevos endpoints que no heredan de generic
  getByLineaAndTurno = createAsyncThunk<IPeriodoLinea, { lineaId: number; turno: string }>(
    `PeriodoLinea/GetByLineaAndTurno`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetByLineaAndTurno(modelo.lineaId, modelo.turno), info);
    }
  );

  getAllRequest = createAsyncThunk<IPeriodoLinea[]>(`IPeriodoLinea/GetAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.GetAllRequest(), thunk);
  });

  putRequest = createAsyncThunk<boolean, IPeriodoLinea>(
    `PeriodoLinea/PutRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.PutRequest(modelo), info);
    }
  );
  postRequest = createAsyncThunk<IPeriodoLinea, IPeriodoLinea>(
    `PeriodoLinea/PostRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.PostRequest(modelo), info);
    }
  );
  deleteRequest = createAsyncThunk<boolean, number>(
    `PeriodoLinea/DeleteRequest`,

    async (number, info) => {
      return await errorNotification(() => this.service.DeleteRequest(number), info);
    }
  );
}
export const PeriodoLineaSliceRequest = new PeriodoLineaClassSlice(periodoLineaService);

const initialState: IIniState<IPeriodoLinea> = {
  loading: null,
  dataAll: [],
  data: null
};

export const PerioodLineaSlice = createSlice({
  name: "PeriodoLinea",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(PeriodoLineaSliceRequest.getByLineaAndTurno.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PeriodoLineaSliceRequest.getByLineaAndTurno.rejected, (state, action) => {
      state.loading = "rejected";
    });
    /*  builder.addCase(PeriodoHoraSliceRequests.getListByPeriodoId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PeriodoHoraSliceRequests.getListByPeriodoId.rejected, (state, action) => {
      state.loading = "rejected";
    }); */
  }
});
