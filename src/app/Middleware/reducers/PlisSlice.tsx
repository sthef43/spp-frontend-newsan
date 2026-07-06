import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { PlisService } from "app/services/plis.service";
import { IPlis } from "app/models/IPlis";
//<IAuth, IAuthUser>
const plisService = new PlisService();

class PlisClassSlice {
  constructor(private service: PlisService) {}
  //Nuevos endpoints que no heredan de generic
  getListByBarcode = createAsyncThunk<IPlis[], { barcode: string }>(`Plis/getListByBarcode`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetListByBarcode(modelo), info);
  });
}

export const PlisSliceRequests = new PlisClassSlice(plisService);

const initialState: IIniState<IPlis> = {
  loading: null,
  data: null
};

export const ReparacionSPSlice = createSlice({
  name: "Plis",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(PlisSliceRequests.getListByBarcode.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlisSliceRequests.getListByBarcode.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
