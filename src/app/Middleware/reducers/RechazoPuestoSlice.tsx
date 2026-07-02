import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IIniState } from "app/models/IIniState";
import { IRechazoPuesto } from "../../models/IRechazoPuesto";
import { RechazoPuestoService } from "../../services/rechazoPuesto.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { GenericSlice } from "./genericSlice";
const rechazoPuestoService = new RechazoPuestoService();
class rechazoPuestoClassSlice extends GenericSlice<IRechazoPuesto> {
  constructor(private service: RechazoPuestoService) {
    super("RechazoPuesto", service);
  }
  //nuevos asyncthunks aqui
  GetAllByProductoIdRequest = createAsyncThunk<IRechazoPuesto[], number>("RechazoPuesto", async (id, info) => {
    return await errorNotification(() => this.service.getAllByProductoIdRequest(id), info);
  });
}
export const RechazoPuestoSliceRequests = new rechazoPuestoClassSlice(rechazoPuestoService);

const initialState: IIniState<IRechazoPuesto> = {
  loading: null,
  data: null,
  object: null,
  dataAll: []
};

export const RechazoPuestoSlice = createSlice({
  name: "RechazoPuesto",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    RechazoPuestoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(RechazoPuestoSliceRequests.GetAllByProductoIdRequest.fulfilled, (state, actions) => {
      state.dataAll = actions.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(RechazoPuestoSliceRequests.GetAllByProductoIdRequest.rejected, (state, actions) => {
      state.loading = "rejected";
    });
  }
});
