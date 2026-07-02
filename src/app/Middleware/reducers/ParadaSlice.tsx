import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IParada } from "app/models/IParada";
import { ParadaService } from "app/services/parada.service";

const paradaService = new ParadaService();

class ParadaClassSlice {
  constructor(private service: ParadaService) {}
  //Nuevos endpoints que no heredan de generic
  getByIdRequest = createAsyncThunk<IParada, number>(`Parada/GetById`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetByIdRequest(modelo), info);
  });

  getAllRequest = createAsyncThunk<IParada[]>(`IParada/GetAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.GetAllRequest(), thunk);
  });

  getListByDesdeHastaRequest = createAsyncThunk<IParada[], { fechaDesde: string; fechaHasta: string }>(
    `IParada/getListByDesdeHasta`,
    async (modelo, thunk) => {
      return await errorNotification(() => this.service.GetListByDesdeHasta(modelo), thunk);
    }
  );
  putRequest = createAsyncThunk<boolean, IParada>(
    `IParada/PutRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.PutRequest(modelo), info);
    }
  );
  postRequest = createAsyncThunk<IParada, IParada>(
    `IParada/PostRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.PostRequest(modelo), info);
    }
  );
  deleteRequest = createAsyncThunk<boolean, number>(
    `IParada/DeleteRequest`,

    async (number, info) => {
      return await errorNotification(() => this.service.DeleteRequest(number), info);
    }
  );
  getByLineaPlantaFechaRequest = createAsyncThunk<IParada, { linea: string; planta: string; fecha: string }>(
    `IParada/getByLineaPlantaFecha`,
    async (modelo, thunk) => {
      return await errorNotification(() => this.service.GetByLineaPlantaFecha(modelo), thunk);
    }
  );
}
export const ParadaSliceRequests = new ParadaClassSlice(paradaService);

const initialState: IIniState<IParada> = {
  loading: null,
  dataAll: [],
  data: null
};

export const PlanProdSlice = createSlice({
  name: "Parada",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(ParadaSliceRequests.getByIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ParadaSliceRequests.getByIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
