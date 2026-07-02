import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IMotivo } from "app/models/IMotivo";
import { MotivoService } from "app/services/motivo.service";

const motivoService = new MotivoService();

class MotivoClassSlice {
  constructor(private service: MotivoService) {}
  //Nuevos endpoints que no heredan de generic
  getByIdRequest = createAsyncThunk<IMotivo, number>(`Motivo/GetById`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetByIdRequest(modelo), info);
  });

  getAllRequest = createAsyncThunk<IMotivo[]>(`IMotivo/GetAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.GetAllRequest(), thunk);
  });

  putRequest = createAsyncThunk<boolean, IMotivo>(
    `IMotivo/PutRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.PutRequest(modelo), info);
    }
  );
  postRequest = createAsyncThunk<IMotivo, IMotivo>(
    `IMotivo/PostRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.PostRequest(modelo), info);
    }
  );
  deleteRequest = createAsyncThunk<boolean, number>(
    `IMotivo/DeleteRequest`,

    async (number, info) => {
      return await errorNotification(() => this.service.DeleteRequest(number), info);
    }
  );
}
export const MotivoSliceRequests = new MotivoClassSlice(motivoService);

const initialState: IIniState<IMotivo> = {
  loading: null,
  dataAll: [],
  data: null
};

export const PlanProdSlice = createSlice({
  name: "Motivo",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(MotivoSliceRequests.getByIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(MotivoSliceRequests.getByIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
