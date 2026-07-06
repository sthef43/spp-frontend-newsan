import { IControlLotePlacas } from "app/models/IControlLotePlacas";

import { IIniState } from "app/models/IIniState";
import { ControlLotePlacasService } from "app/services/controlLotePlacas.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const planProdService = new ControlLotePlacasService();

interface prop {
  modeloA: string;
  modeloB: string;
}

class ControlLotePlacasClassSlice {
  constructor(private service: ControlLotePlacasService) {}
  //Nuevos endpoints que no heredan de generic
  
  getListByEMPQDeclarations = createAsyncThunk<IControlLotePlacas[], string>(
    `ControlLotePlacas/GetListByEMPQDeclarations`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getListByEMPQDeclarations(modelo), info);
    }
  );
  putRequest = createAsyncThunk<boolean, IControlLotePlacas>(
    `ControlLotePlacas/PutRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.putRequest(modelo), info);
    }
  );
  multiPut = createAsyncThunk<boolean, IControlLotePlacas[]>(
    `ControlLotePlacas/MultiPut`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.multiPut(modelo), info);
    }
  );
  multiPost = createAsyncThunk<boolean, IControlLotePlacas[]>(
    `ControlLotePlacas/MultiPost`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.multiPost(modelo), info);
    }
  );

  deleteRequest = createAsyncThunk<boolean, number>(`ControlLotePlacas/DeleteRequest`, async (modelo, info) => {
    return await errorNotification(() => this.service.deleteRequest(modelo), info);
  });
}
export const ControlLotePlacasSliceRequests = new ControlLotePlacasClassSlice(planProdService);

const initialState: IIniState<IControlLotePlacas> = {
  loading: null,
  data: null
};

export const ControlLotePlacasSlice = createSlice({
  name: "ControlLotePlacas",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(ControlLotePlacasSliceRequests.getListByEMPQDeclarations.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ControlLotePlacasSliceRequests.getListByEMPQDeclarations.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ControlLotePlacasSliceRequests.multiPut.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ControlLotePlacasSliceRequests.multiPut.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ControlLotePlacasSliceRequests.multiPost.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ControlLotePlacasSliceRequests.multiPost.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ControlLotePlacasSliceRequests.deleteRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ControlLotePlacasSliceRequests.deleteRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
