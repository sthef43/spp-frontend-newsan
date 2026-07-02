import { IPedidoMaterialesProduccion } from "app/models/IPedidoMaterialesProduccion";

import { IIniState } from "app/models/IIniState";
import { PedidoMaterialesProduccionService } from "app/services/pedidoMaterialesProduccion.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const planProdService = new PedidoMaterialesProduccionService();

interface prop {
  modeloA: string;
  modeloB: string;
}

class PedidoMaterialesProduccionClassSlice {
  constructor(private service: PedidoMaterialesProduccionService) {}
  //Nuevos endpoints que no heredan de generic

  // multiPostRequest = createAsyncThunk<boolean, IPedidoMaterialesProduccion[]>(
  //   `PedidoMaterialesProduccion/MultiPostRequest`,
  //   async (modelo, info) => {
  //     return await errorNotification(() => this.service.multiPostRequest(modelo), info);
  //   }
  // );

  getByIdRequest = createAsyncThunk<IPedidoMaterialesProduccion, number>(
    `PedidoMaterialesProduccion/GetById`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getByIdRequest(modelo), info);
    }
  );

  getAllPedidoMaterialesProduccionRequest = createAsyncThunk<IPedidoMaterialesProduccion[]>(
    `PedidoMaterialesProduccion/GetAllPedidoMaterialesProduccion`,
    async (info, thunk) => {
      return await errorNotification(() => this.service.getAllPedidoMaterialesProduccionRequest(), thunk);
    }
  );
  postRequest = createAsyncThunk<IPedidoMaterialesProduccion, IPedidoMaterialesProduccion>(
    `PedidoMaterialesProduccion/PostRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.postRequest(modelo), info);
    }
  );
  putRequest = createAsyncThunk<boolean, IPedidoMaterialesProduccion>(
    `PedidoMaterialesProduccion/PutRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.putRequest(modelo), info);
    }
  );
}
export const PedidoMaterialesProduccionSliceRequests = new PedidoMaterialesProduccionClassSlice(planProdService);

const initialState: IIniState<IPedidoMaterialesProduccion> = {
  loading: null,
  data: null
};

export const PedidoMaterialesProduccionSlice = createSlice({
  name: "PedidoMaterialesProduccion",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    // builder.addCase(PedidoMaterialesProduccionSliceRequests.multiPostRequest.fulfilled, (state, action) => {
    //   state.loading = "fulfilled";
    //   state.data = action.payload;
    // });
    // builder.addCase(PedidoMaterialesProduccionSliceRequests.multiPostRequest.rejected, (state, action) => {
    //   state.loading = "rejected";
    // });
    builder.addCase(
      PedidoMaterialesProduccionSliceRequests.getAllPedidoMaterialesProduccionRequest.fulfilled,
      (state, action) => {
        state.loading = "fulfilled";
        state.data = action.payload;
      }
    );
    builder.addCase(
      PedidoMaterialesProduccionSliceRequests.getAllPedidoMaterialesProduccionRequest.rejected,
      (state, action) => {
        state.loading = "rejected";
      }
    );
    builder.addCase(PedidoMaterialesProduccionSliceRequests.postRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PedidoMaterialesProduccionSliceRequests.postRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PedidoMaterialesProduccionSliceRequests.putRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PedidoMaterialesProduccionSliceRequests.putRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
