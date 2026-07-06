import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { Stock_CLIService } from "app/services/cli_ucl.service";
import { IStock_CLI } from "app/models/IStock_CLI";

const stock_cliService = new Stock_CLIService();

class Stock_CLIClassSlice {
  constructor(private service: Stock_CLIService) {}
  //Nuevos endpoints que no heredan de generic
  getByLocalizador = createAsyncThunk<IStock_CLI[], string>(
    `Stock_CLI/GetByLocalizador`,
    async (string, info) => {
      return await errorNotification(() => this.service.getByLocalizador(string), info);
    }
  );
}
export const Stock_CLISliceRequests = new Stock_CLIClassSlice(stock_cliService);

const initialState: IIniState<IStock_CLI> = {
  loading: null,
  data: null
};

export const Stock_CLISlice = createSlice({
  name: "Stock_CLI",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(Stock_CLISliceRequests.getByLocalizador.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(Stock_CLISliceRequests.getByLocalizador.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
