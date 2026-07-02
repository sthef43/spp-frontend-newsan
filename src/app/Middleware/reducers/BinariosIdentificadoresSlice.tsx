import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models";
import { IBinariosIdentificadores } from "app/models/IBinariosIdentificadores";
import { BinariosIdentificadoresService } from "app/services/binariosIdentificadores.service";
import { GenericSlice } from "./genericSlice";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const binariosIdentificadoresService = new BinariosIdentificadoresService();

class binariosIdentificadoresClassSlice extends GenericSlice<IBinariosIdentificadores> {
  url = "BinariosIdentificadores";
  constructor(private service: BinariosIdentificadoresService) {
    super("BinariosIdentificadores", service);
  }
  getAllNotMapped = createAsyncThunk<IBinariosIdentificadores[], number>(
    "BinariosIdentificadores/GetAllNotMapped",
    async (puestoLineaSeleccionada: number, info) => {
      return await errorNotification(() => this.service.GetAllNotMapped(puestoLineaSeleccionada), info);
    }
  );
}
export const BinariosIdentificadoresSliceRequest = new binariosIdentificadoresClassSlice(
  binariosIdentificadoresService
);
export interface IBinarioExt extends IIniState<IBinariosIdentificadores> {
  ocultar: boolean;
}

const initialState: IBinarioExt = {
  loading: null,
  data: null,
  dataAll: [],
  object: null,
  ocultar: false
};
export const BinariosIdentificadoresSlice = createSlice({
  name: "BinariosIdentificadores",
  initialState: initialState,
  reducers: {
    hiddenNavBar: (state, action: PayloadAction<boolean>) => {
      state.ocultar = action.payload;
    }
  },
  extraReducers(builder) {
    BinariosIdentificadoresSliceRequest.builderAll(builder);
    builder.addCase(BinariosIdentificadoresSliceRequest.getAllNotMapped.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(BinariosIdentificadoresSliceRequest.getAllNotMapped.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
