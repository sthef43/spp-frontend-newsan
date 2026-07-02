import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { TRANS_OK_DETService } from "app/services/trans_OK_DET.service";
import { ITRANS_OK_DET } from "app/models/ITRANS_OK_DET";

const trans_OK_DETService = new TRANS_OK_DETService();
class trans_OK_DETClassSlice {
  constructor(private service: TRANS_OK_DETService) {}
  getAllRequest = createAsyncThunk<ITRANS_OK_DET[]>(
    `TRANS_OK_DET/GetAllRequest`,

    async (x, info) => {
      return await errorNotification(() => this.service.GetAllRequest(), info);
    }
  );
  //nuevos asyncthunks aqui
}
export const TRANS_OK_DETSliceRequests = new trans_OK_DETClassSlice(trans_OK_DETService);

const initialState: IIniState<ITRANS_OK_DET> = {
  loading: null,
  data: null
};

export const TrazabilidadLgSlice = createSlice({
  name: "TRANS_OK_DET",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //nuevos manejos de asyncthunk aqui
    builder.addCase(TRANS_OK_DETSliceRequests.getAllRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload as any;
    });
    builder.addCase(TRANS_OK_DETSliceRequests.getAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
