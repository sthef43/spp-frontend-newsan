import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { ZPL_ImpresoraService } from "app/services/zpl_Impresora.service";
//<IAuth, IAuthUser>
const zpl_impresoraService = new ZPL_ImpresoraService();
class ZPL_ImpresoraClassSlice {
  constructor(private service: ZPL_ImpresoraService) {}
  //Nuevos endpoints que no heredan de generic
  getPrinters = createAsyncThunk<Array<string>>(`ZPL_Print/GetPrinters`, async (info, thunk) => {
    return await errorNotification(() => this.service.getPrinters(), thunk);
  });
  print = createAsyncThunk<boolean, Array<string>>(`ZPL_Print/Print`, async (modelo, thunk) => {
    return await errorNotification(() => this.service.print(modelo), thunk);
  });
  getPrintersWithPorts = createAsyncThunk<Array<string>>(`ZPL_Print/GetAllPrinterListWithPort`, async (modelo, thunk) => {
    return await errorNotification(() => this.service.getPrintsWithPort(), thunk);
  });
}
export const ZPL_ImpresoraSliceRequests = new ZPL_ImpresoraClassSlice(zpl_impresoraService);
const initialState: IIniState<string> = {
  loading: null,
  dataAll: [],
  data: null
};
export const ZPL_ImpresoraSlice = createSlice({
  name: "ZPL_Impresora",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
  }
});
