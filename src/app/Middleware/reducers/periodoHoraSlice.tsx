import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { PeriodoHoraService } from "app/services/periodoHora.service";
import { IPeriodoHora } from "app/models/IPeriodoHora";
//<IAuth, IAuthUser>
const periodoHoraService = new PeriodoHoraService();
/* 
interface propsReporte {
  planProd: IPlanProd[];
  fechaDesde: string;
  fechaHasta: string;
} */

class PeriodoHoraClassSlice {
  constructor(private service: PeriodoHoraService) {}
  //Nuevos endpoints que no heredan de generic
  getByIdRequest = createAsyncThunk<IPeriodoHora, number>(`PeriodoHora/GetById`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetByIdRequest(modelo), info);
  });

  getListByPeriodoId = createAsyncThunk<IPeriodoHora[], number>(`PeriodoHora/GetByPeriodoId`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetByPeriodoId(modelo), info);
  });

  getAllRequest = createAsyncThunk<IPeriodoHora[]>(`IPeriodoHora/GetAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.GetAllRequest(), thunk);
  });

  putRequest = createAsyncThunk<boolean, IPeriodoHora>(
    `IPeriodoHora/PutRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.PutRequest(modelo), info);
    }
  );
  postRequest = createAsyncThunk<IPeriodoHora, IPeriodoHora>(
    `IPeriodoHora/PostRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.PostRequest(modelo), info);
    }
  );
  deleteRequest = createAsyncThunk<boolean, number>(
    `IPeriodoHora/DeleteRequest`,

    async (number, info) => {
      return await errorNotification(() => this.service.DeleteRequest(number), info);
    }
  );
}
export const PeriodoHoraSliceRequests = new PeriodoHoraClassSlice(periodoHoraService);

const initialState: IIniState<IPeriodoHora> = {
  loading: null,
  dataAll: [],
  data: null
};

export const PlanProdSlice = createSlice({
  name: "PeriodoHora",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(PeriodoHoraSliceRequests.getByIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PeriodoHoraSliceRequests.getByIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(PeriodoHoraSliceRequests.getListByPeriodoId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PeriodoHoraSliceRequests.getListByPeriodoId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
