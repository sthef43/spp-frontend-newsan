import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IRechazoMain } from "app/models/IRechazoMain";
import { RechazoMainService } from "app/services/rechazoMai.service";
const rechazoMainService = new RechazoMainService();
class rechazoMainClassSlice {
  constructor(private service: RechazoMainService) {}
  //nuevos asyncthunks aqui
  getInforme = createAsyncThunk<IRechazoMain[], { fechaDesde; fechaHasta; lineaId; turno }>(
    "RechazoMain",
    async (modelo, info) => {
      return await errorNotification(() => this.service.getInforme(modelo), info);
    }
  );
}
export const RechazoMainSliceRequests = new rechazoMainClassSlice(rechazoMainService);

const initialState: IIniState<IRechazoMain> = {
  loading: null,
  data: null,
  object: null,
  dataAll: []
};

export const RechazoMainSlice = createSlice({
  name: "RechazoMain",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //nuevos manejos de asyncthunk aqui
    builder.addCase(RechazoMainSliceRequests.getInforme.fulfilled, (state, actions) => {
      state.dataAll = actions.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(RechazoMainSliceRequests.getInforme.rejected, (state, _) => {
      state.loading = "rejected";
    });
  }
});
