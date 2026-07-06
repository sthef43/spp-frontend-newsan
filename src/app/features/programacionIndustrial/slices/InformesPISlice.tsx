import { IInformesPI } from "app/models/IInformesPI";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { InformesPIService } from "../services/informesPI.service";
import { IIniState } from "app/models";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const informesPIService = new InformesPIService();
class informesPIClassSlice extends GenericSlice<IInformesPI> {
  constructor(private service: InformesPIService) {
    super("InformesPI", service);
  }
  getAllByPlantId = createAsyncThunk<IInformesPI[], { plantId; fecha; turnoId }>(
    `InformesPI/GetAllByPlantId`,
    async (varios, info) => {
      return await errorNotification(() => this.service.getAllByPlantId(varios), info);
    }
  );
}
export const InformesPISliceRequest = new informesPIClassSlice(informesPIService);

const initialState: IIniState<IInformesPI> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};
export const InformesPISlice = createSlice({
  name: "InformesPISlice",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    InformesPISliceRequest.builderAll(builder);
    builder.addCase(InformesPISliceRequest.getAllByPlantId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(InformesPISliceRequest.getAllByPlantId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
