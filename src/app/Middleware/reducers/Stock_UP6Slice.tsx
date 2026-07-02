import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IStock_UP6 } from "app/models/IStock_UP6";
import { Stock_UP6Service } from "app/services/cli_up6.service";

const stock_up6Service = new Stock_UP6Service();

class Stock_UP6ClassSlice {
  constructor(private service: Stock_UP6Service) {}
  //Nuevos endpoints que no heredan de generic
  getByLocalizador = createAsyncThunk<IStock_UP6[], { localizador }>(
    `Stock_UP6/GetByLocalizador`,
    async (localizador, info) => {
      return await errorNotification(() => this.service.getByLocalizador(localizador), info);
    }
  );
}
export const Stock_UP6SliceRequests = new Stock_UP6ClassSlice(stock_up6Service);

const initialState: IIniState<IStock_UP6> = {
  loading: null,
  data: null
};

export const Stock_UP6Slice = createSlice({
  name: "Stock_UP6",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(Stock_UP6SliceRequests.getByLocalizador.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(Stock_UP6SliceRequests.getByLocalizador.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
