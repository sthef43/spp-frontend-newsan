import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models/IIniState";
import { GenericSliceMes } from "./genericSliceMes";
import { ProductionOrdersService } from "app/services/mes/produccionOrders.service";
import { IProductionOrders } from "app/models/mes/IProductionOrders";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const productionOrdersService = new ProductionOrdersService();

class productionOrdersClassSlice extends GenericSliceMes<IProductionOrders> {
  constructor(private service: ProductionOrdersService) {
    super("ProductionOrders", service);
  }
  getByProduct = createAsyncThunk<IProductionOrders[], { producto: number; planta: number }>(
    "getByProduct",
    async (data, info) => {
      return await errorNotification(() => this.service.getbyproduct(data.producto, data.planta), info);
    }
  );
  //nuevos asyncthunks aqui
}
export const ProductionOrdersSliceRequests = new productionOrdersClassSlice(productionOrdersService);

const initialState: IIniState<IProductionOrders> = {
  loading: null,
  data: null
};

export const productionOrdersSlice = createSlice({
  name: "ProductionOrders",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ProductionOrdersSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(ProductionOrdersSliceRequests.getByProduct.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ProductionOrdersSliceRequests.getByProduct.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
