import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ITrazaManualHistory } from "app/models/ITrazaManualHistory";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { TrazaManualHistoryService } from "../services/trazaManualHistory.service";
//<IAuth, IAuthUser>
const trazaManualHistoryService = new TrazaManualHistoryService();

class TrazaManualHistoryClassSlice extends GenericSlice<ITrazaManualHistory> {
  constructor(private service: TrazaManualHistoryService) {
    super("TrazaManualHistory", service);
  }
  //Nuevos endpoints que no heredan de generic
  getAllByNroSerieRequest = createAsyncThunk<ITrazaManualHistory[], string>(
    `trazaManualHistory/GetAllByNroSerie`,
    async (codigo, info) => {
      return await errorNotification(() => this.service.getAllByNroSerie(codigo), info);
    }
  );
}
export const TrazaManualHistorySliceRequests = new TrazaManualHistoryClassSlice(trazaManualHistoryService);

const initialState: IIniState<ITrazaManualHistory> = {
  loading: null,
  dataAll: [],
  data: null
};

export const TrazaManualSlice = createSlice({
  name: "TrazaManualHistory",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    TrazaManualHistorySliceRequests.builderAll(builder);
    //Nuevos slices que no heredan de generic
    builder.addCase(TrazaManualHistorySliceRequests.getAllByNroSerieRequest.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.dataAll = action.payload;
    });
    builder.addCase(TrazaManualHistorySliceRequests.getAllByNroSerieRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
