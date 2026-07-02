import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { ITrazaProductoPuesto } from "app/models/ITrazaProductoPuesto";
import { TrazaProductoPuestoService } from "app/services/trazaProductoPuesto.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const trazaProductoPuestoService = new TrazaProductoPuestoService();

class trazaProductoPuestoClassSlice extends GenericSlice<ITrazaProductoPuesto> {
  constructor(private service: TrazaProductoPuestoService) {
    super("TrazaProductoPuesto", service);
  }
  //nuevos asyncthunks aqui

  getProductoPuestoByProductoId = createAsyncThunk<ITrazaProductoPuesto[], number>(
    `TrazaProductoPuesto/getProductoPuestoByProductoId`,
    async (productoId, info) => {
      return await errorNotification(() => this.service.getProductoPuestoByProductoId(productoId), info);
    }
  );
}
export const TrazaProductoPuestoSliceRequests = new trazaProductoPuestoClassSlice(trazaProductoPuestoService);

const initialState: IIniState<ITrazaProductoPuesto> = {
  loading: null,
  data: null
};

export const trazaProductoPuestoSlice = createSlice({
  name: "TrazaProductoPuesto",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    TrazaProductoPuestoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk que no heredan de generic
    builder.addCase(TrazaProductoPuestoSliceRequests.getProductoPuestoByProductoId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(TrazaProductoPuestoSliceRequests.getProductoPuestoByProductoId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
