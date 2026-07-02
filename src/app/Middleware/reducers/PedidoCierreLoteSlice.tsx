import { IPedidoCierreLote } from "app/models/IPedidoCierreLote";

import { IIniState } from "app/models/IIniState";
import { PedidoCierreLoteService } from "app/services/pedidoCierreLote.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const planProdService = new PedidoCierreLoteService();

interface prop {
  modeloA: string;
  modeloB: string;
}

class PedidoCierreLoteClassSlice {
  constructor(private service: PedidoCierreLoteService) {}
  //Nuevos endpoints que no heredan de generic

  // multiPostRequest = createAsyncThunk<boolean, IPedidoCierreLote[]>(
  //   `PedidoCierreLote/MultiPostRequest`,
  //   async (modelo, info) => {
  //     return await errorNotification(() => this.service.multiPostRequest(modelo), info);
  //   }
  // );

  getByIdRequest = createAsyncThunk<IPedidoCierreLote, number>(`PedidoCierreLote/GetById`, async (modelo, info) => {
    return await errorNotification(() => this.service.getByIdRequest(modelo), info);
  });

  getAllPedidoCierreLoteRequest = createAsyncThunk<IPedidoCierreLote[]>(
    `PedidoCierreLote/GetAllPedidoCierreLote`,
    async (info, thunk) => {
      return await errorNotification(() => this.service.getAllPedidoCierreLoteRequest(), thunk);
    }
  );
  postRequest = createAsyncThunk<IPedidoCierreLote, IPedidoCierreLote>(
    `PedidoCierreLote/PostRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.postRequest(modelo), info);
    }
  );
  putRequest = createAsyncThunk<boolean, IPedidoCierreLote>(
    `PedidoCierreLote/PutRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.putRequest(modelo), info);
    }
  );
}
export const PedidoCierreLoteSliceRequests = new PedidoCierreLoteClassSlice(planProdService);

const initialState: IIniState<IPedidoCierreLote> = {
  loading: null,
  data: null
};

export const PedidoCierreLoteSlice = createSlice({
  name: "PedidoCierreLote",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    // builder.addCase(PedidoCierreLoteSliceRequests.multiPostRequest.fulfilled, (state, action) => {
    //   state.loading = "fulfilled";
    //   state.data = action.payload;
    // });
    // builder.addCase(PedidoCierreLoteSliceRequests.multiPostRequest.rejected, (state, action) => {
    //   state.loading = "rejected";
    // });
    builder.addCase(PedidoCierreLoteSliceRequests.getAllPedidoCierreLoteRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PedidoCierreLoteSliceRequests.getAllPedidoCierreLoteRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PedidoCierreLoteSliceRequests.postRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PedidoCierreLoteSliceRequests.postRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PedidoCierreLoteSliceRequests.putRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PedidoCierreLoteSliceRequests.putRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
