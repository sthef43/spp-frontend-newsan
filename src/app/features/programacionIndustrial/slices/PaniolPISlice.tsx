import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models/IIniState";
import { PaniolPIService } from "../services/paniolPI.service";
import { IPaniolPI } from "app/models/IPaniolPI";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const paniolPIService = new PaniolPIService();
class paniolPIClass extends GenericSlice<IPaniolPI> {
  constructor(private service: PaniolPIService) {
    super("PaniolPI", service);
  }
  //nuevos asyncthunks aqui
  getAllByPlantId = createAsyncThunk<IPaniolPI[], number>("PaniolPI/GetAllByPlantId", async (plantId, info) => {
    return await errorNotification(() => this.service.GetAllByPlantId(plantId), info);
  });
  getAllHistoryByArticulo = createAsyncThunk<IPaniolPI[], string>(
    "PaniolPI/GetAllHistoryById",
    async (articulo, info) => {
      return await errorNotification(() => this.service.GetAllHistoryByArticulo(articulo), info);
    }
  );
  putChangeMovimiento = createAsyncThunk<IPaniolPI, number>("PaniolPI/PutChangeMovimiento", async (id, info) => {
    return await errorNotification(() => this.service.PutChangeMovimiento(id), info);
  });
}
export const PaniolPISliceRequests = new paniolPIClass(paniolPIService);

const initialState: IIniState<IPaniolPI> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const PaniolSlice = createSlice({
  name: "PaniolPI",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    PaniolPISliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(PaniolPISliceRequests.getAllByPlantId.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(PaniolPISliceRequests.getAllByPlantId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PaniolPISliceRequests.putChangeMovimiento.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(PaniolPISliceRequests.putChangeMovimiento.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
