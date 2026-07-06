import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { MainRegService } from "app/services/mainReg.service";
import { IMainReg } from "app/models/IMainReg";
//<IAuth, IAuthUser>
const mainRegService = new MainRegService();

class MainRegClassSlice {
  constructor(private service: MainRegService) {}
  //Nuevos endpoints que no heredan de generic
  getAllRequest = createAsyncThunk<IMainReg[]>(`MainReg/GetAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.getAllRequest(), thunk);
  });
  getAllByCodigo = createAsyncThunk<IMainReg[], { codigo; tipoDeCodigo }>(
    `MainReg/GetAllByCodigo`,
    async (codigo, info) => {
      return await errorNotification(() => this.service.getAllByCodigo(codigo), info);
    }
  );
  putRequest = createAsyncThunk<boolean, IMainReg>(`MainReg/Put`, async (codigo, info) => {
    return await errorNotification(() => this.service.putRequest(codigo), info);
  });
}
export const MainRegSliceRequests = new MainRegClassSlice(mainRegService);

const initialState: IIniState<IMainReg> = {
  loading: null,
  dataAll: [],
  data: null
};

export const MainRegSlice = createSlice({
  name: "MainReg",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(MainRegSliceRequests.getAllRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(MainRegSliceRequests.getAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(MainRegSliceRequests.getAllByCodigo.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(MainRegSliceRequests.getAllByCodigo.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
