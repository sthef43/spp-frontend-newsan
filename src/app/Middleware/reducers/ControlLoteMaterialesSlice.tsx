import { IControlLoteMateriales } from "app/models/IControlLoteMateriales";

import { IIniState } from "app/models/IIniState";
import { ControlLoteMaterialesService } from "app/services/controlLoteMateriales.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const planProdService = new ControlLoteMaterialesService();

interface prop {
  modeloA: string;
  modeloB: string;
}

class ControlLoteMaterialesClassSlice {
  constructor(private service: ControlLoteMaterialesService) {}
  //Nuevos endpoints que no heredan de generic
  postRequest = createAsyncThunk<IControlLoteMateriales, IControlLoteMateriales>(
    `ControlLoteMateriales/PostRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.postRequest(modelo), info);
    }
  );

  multiPostRequest = createAsyncThunk<boolean, IControlLoteMateriales[]>(
    `ControlLoteMateriales/MultiPostRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.multiPostRequest(modelo), info);
    }
  );
  getMaterialesByIdControlLote = createAsyncThunk<IControlLoteMateriales[], number>(
    `ControlLoteMateriales/GetMaterialesByModeloNumeroOp`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getMaterialesByIdControlLote(modelo), info);
    }
  );

  deleteRequest = createAsyncThunk<boolean, number>(`ControlLoteMateriales/DeleteRequest`, async (modelo, info) => {
    return await errorNotification(() => this.service.deleteRequest(modelo), info);
  });
}
export const ControlLoteMaterialesSliceRequests = new ControlLoteMaterialesClassSlice(planProdService);

const initialState: IIniState<IControlLoteMateriales> = {
  loading: null,
  data: null
};

export const ControlLoteMaterialesSlice = createSlice({
  name: "ControlLoteMateriales",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(ControlLoteMaterialesSliceRequests.postRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ControlLoteMaterialesSliceRequests.postRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ControlLoteMaterialesSliceRequests.multiPostRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ControlLoteMaterialesSliceRequests.multiPostRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ControlLoteMaterialesSliceRequests.deleteRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ControlLoteMaterialesSliceRequests.deleteRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
