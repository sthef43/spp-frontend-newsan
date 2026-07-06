import { IReprocesoLote } from "app/models/IReprocesoLote";
import { IIniState } from "app/models/IIniState";
import { ReprocesoLoteService } from "app/features/calidad/services/reprocesoLote.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const reprocesoLoteService = new ReprocesoLoteService();

class ReprocesoLoteClassSlice {
  constructor(private service: ReprocesoLoteService) {}
  //Nuevos endpoints que no heredan de generic
  getAllByIdControlLoteRequest = createAsyncThunk<IReprocesoLote[], number>(
    `ReprocesoLote/GetAllReprocesos`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getAllByIdControlLoteRequest(modelo), info);
    }
  );

  multiPostRequest = createAsyncThunk<boolean, IReprocesoLote[]>(
    `ReprocesoLote/MultiPostRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.multiPostRequest(modelo), info);
    }
  );
}
export const ReprocesoLoteSliceRequests = new ReprocesoLoteClassSlice(reprocesoLoteService);

const initialState: IIniState<IReprocesoLote> = {
  loading: null,
  data: null
};

export const ReprocesoLoteSlice = createSlice({
  name: "ReprocesoLote",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic

    builder.addCase(ReprocesoLoteSliceRequests.getAllByIdControlLoteRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ReprocesoLoteSliceRequests.getAllByIdControlLoteRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
