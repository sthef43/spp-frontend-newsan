import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IPeriodo } from "app/models/IPeriodo";
import { PeriodoService } from "app/services/periodo.service";
//<IAuth, IAuthUser>
const periodoService = new PeriodoService();
/* 
interface propsReporte {
  planProd: IPlanProd[];
  fechaDesde: string;
  fechaHasta: string;
} */

class PeriodoClassSlice {
  constructor(private service: PeriodoService) {}
  //Nuevos endpoints que no heredan de generic
  getByIdRequest = createAsyncThunk<IPeriodo, number>(`Periodo/GetById`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetByIdRequest(modelo), info);
  });

  getListByPeriodoId = createAsyncThunk<IPeriodo[], number>(`Periodo/GetByPeriodoId`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetByPeriodoId(modelo), info);
  });

  getAllRequest = createAsyncThunk<IPeriodo[]>(`IPeriodo/GetAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.GetAllRequest(), thunk);
  });

  putRequest = createAsyncThunk<boolean, IPeriodo>(
    `IPeriodo/PutRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.PutRequest(modelo), info);
    }
  );
  postRequest = createAsyncThunk<IPeriodo, IPeriodo>(
    `IPeriodo/PostRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.PostRequest(modelo), info);
    }
  );
  deleteRequest = createAsyncThunk<boolean, number>(
    `IPeriodo/DeleteRequest`,

    async (number, info) => {
      return await errorNotification(() => this.service.DeleteRequest(number), info);
    }
  );
}
export const PeriodoSliceRequests = new PeriodoClassSlice(periodoService);

const initialState: IIniState<IPeriodo> = {
  loading: null,
  dataAll: [],
  data: null
};

export const PlanProdSlice = createSlice({
  name: "Periodo",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(PeriodoSliceRequests.getByIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PeriodoSliceRequests.getByIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(PeriodoSliceRequests.getListByPeriodoId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PeriodoSliceRequests.getListByPeriodoId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
