import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SubLineaScrapService } from "app/services/subLineaScrap.service";
import { ISubLineaScrap } from "app/models/ISubLineaScrap";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const subLineaScrapService = new SubLineaScrapService();
class subLineaScrapClassService extends GenericSlice<ISubLineaScrap> {
  constructor(private service: SubLineaScrapService) {
    super("SubLineaScrap", service);
  }
  getAllOfDay = createAsyncThunk<ISubLineaScrap[]>("SubLineaScrap/getAllOfDay", async (x, info) => {
    return await errorNotification(() => this.service.getAllOfDay(), info);
  });
  //nuevos asyncthunks aqui
}
export const SubLineaScrapSliceRequests = new subLineaScrapClassService(subLineaScrapService);

const initialState: IIniState<ISubLineaScrap> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const subLineaScrapSlice = createSlice({
  name: "SubLineaScrap",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    SubLineaScrapSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(SubLineaScrapSliceRequests.getAllOfDay.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(SubLineaScrapSliceRequests.getAllOfDay.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
