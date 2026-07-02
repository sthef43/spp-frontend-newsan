import { ITargets } from "app/models/ITargets";

import { IIniState } from "app/models/IIniState";
import { TargetsService } from "app/services/targets.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const targetsService = new TargetsService();

class TargetsClassSlice {
  constructor(private service: TargetsService) {}
  //Nuevos endpoints que no heredan de generic
  getTargetByIdLineaGenericoRequest = createAsyncThunk<ITargets, { idLinea; generico }>(
    `Targets/GetAllByIdLineaGenericoRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getTargetByIdLineaGenericoRequest(modelo), info);
    }
  );
  putRequest = createAsyncThunk<ITargets, ITargets>(`Target`, async (modelo, info) => {
    return await errorNotification(() => this.service.putRequest(modelo), info);
  });
  getListByIdLineaRequest = createAsyncThunk<ITargets[], number>(`Targets/GetListByIdLinea`, async (modelo, info) => {
    return await errorNotification(() => this.service.getListByIdLinea(modelo), info);
  });
  postRequest = createAsyncThunk<ITargets, ITargets>(`Target`, async (modelo, info) => {
    return await errorNotification(() => this.service.postRequest(modelo), info);
  });
}
export const TargetsSliceRequests = new TargetsClassSlice(targetsService);

const initialState: IIniState<ITargets> = {
  loading: null,
  data: null,
  object: null
};

export const TargetsSlice = createSlice({
  name: "Targets",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(TargetsSliceRequests.getTargetByIdLineaGenericoRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.object = action.payload;
    });
    builder.addCase(TargetsSliceRequests.getTargetByIdLineaGenericoRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(TargetsSliceRequests.putRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.object = action.payload;
    });
    builder.addCase(TargetsSliceRequests.putRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
