import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IRechazoMultiple, RechazoMultipleService } from "app/features/calidad/services/rechazoMultiple.service";

const rechazoMultipleService = new RechazoMultipleService();

class RechazoClassSlice {
  constructor(private service: RechazoMultipleService) {}
  GetByDay = createAsyncThunk<
    IRechazoMultiple[],
    { day: number; month: number; year: number; idLinea: number; codigoRechazo: number }
  >(`Rechazo/GetByDay`, async (modelo, info) => {
    return await errorNotification(
      () => this.service.GetByDay(modelo.day, modelo.month, modelo.year, modelo.idLinea, modelo.codigoRechazo),
      info
    );
  });
}
export const RechazoMultipleSliceRequests = new RechazoClassSlice(rechazoMultipleService);

const initialState: IIniState<any> = {
  loading: null,
  dataAll: [],
  data: null,
  object: null
};

export const RechazoSlice = createSlice({
  name: "RechazoMultiple",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(RechazoMultipleSliceRequests.GetByDay.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.object = action.payload;
    });
  }
});
