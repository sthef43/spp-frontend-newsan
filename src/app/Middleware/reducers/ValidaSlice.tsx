import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IValida } from "app/models/IValida";
import { ValidaService } from "app/services/valida.service";

const validaService = new ValidaService();

class ValidaClassSlice {
  constructor(private service: ValidaService) {}
  //Nuevos endpoints que no heredan de generic
  getByIdRequest = createAsyncThunk<IValida, number>(`Valida/GetById`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetByIdRequest(modelo), info);
  });

  getAllRequest = createAsyncThunk<IValida[]>(`IValida/GetAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.GetAllRequest(), thunk);
  });

  putRequest = createAsyncThunk<boolean, IValida>(
    `IValida/PutRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.PutRequest(modelo), info);
    }
  );
  postRequest = createAsyncThunk<IValida, IValida>(
    `IValida/PostRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.PostRequest(modelo), info);
    }
  );
  deleteRequest = createAsyncThunk<boolean, number>(
    `IValida/DeleteRequest`,

    async (number, info) => {
      return await errorNotification(() => this.service.DeleteRequest(number), info);
    }
  );
}
export const ValidaSliceRequests = new ValidaClassSlice(validaService);

const initialState: IIniState<IValida> = {
  loading: null,
  dataAll: [],
  data: null
};

export const PlanProdSlice = createSlice({
  name: "Valida",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(ValidaSliceRequests.getByIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ValidaSliceRequests.getByIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
