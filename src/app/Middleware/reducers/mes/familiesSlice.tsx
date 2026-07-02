import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models/IIniState";
import { GenericSliceMes } from "./genericSliceMes";
import { FamiliesService } from "app/services/mes/families.service";
import { IFamilies } from "app/models/mes/IFamilies";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const familiesService = new FamiliesService();
class familiesClassSlice extends GenericSliceMes<IFamilies> {
  constructor(private service: FamiliesService) {
    super("Families", service);
  }
  getbyproductoLinea = createAsyncThunk<IFamilies[], number>("getByProduct", async (data, info) => {
    return await errorNotification(() => this.service.getbyproductoLinea(data), info);
  });
  //nuevos asyncthunks aqui
}
export const FamiliesSliceRequests = new familiesClassSlice(familiesService);

const initialState: IIniState<IFamilies> = {
  loading: null,
  data: null
};

export const familiesSlice = createSlice({
  name: "Families",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    FamiliesSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui

    builder.addCase(FamiliesSliceRequests.getbyproductoLinea.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(FamiliesSliceRequests.getbyproductoLinea.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
