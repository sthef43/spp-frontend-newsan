import { IPedidoMaterialesCalidad } from "app/models/IPedidoMaterialesCalidad";

import { IIniState } from "app/models/IIniState";
import { PedidoMaterialesCalidadService } from "app/services/pedidoMaterialesCalidad.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const controlLoteService = new PedidoMaterialesCalidadService();

interface prop {
  modeloA: string;
  modeloB: string;
}

class PedidoMaterialesCalidadClassSlice {
  constructor(private service: PedidoMaterialesCalidadService) {}
  //Nuevos endpoints que no heredan de generic

  // multiPostRequest = createAsyncThunk<boolean, IPedidoMaterialesCalidad[]>(
  //   `PedidoMaterialesCalidad/MultiPostRequest`,
  //   async (modelo, info) => {
  //     return await errorNotification(() => this.service.multiPostRequest(modelo), info);
  //   }
  // );

  getByIdRequest = createAsyncThunk<IPedidoMaterialesCalidad, number>(
    `PedidoMaterialesCalidad/GetById`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getByIdRequest(modelo), info);
    }
  );

  getAllPedidoMaterialesCalidadRequest = createAsyncThunk<IPedidoMaterialesCalidad[]>(
    `PedidoMaterialesCalidad/GetAllPedidoMaterialesCalidad`,
    async (info, thunk) => {
      return await errorNotification(() => this.service.getAllPedidoMaterialesCalidadRequest(), thunk);
    }
  );
  postRequest = createAsyncThunk<IPedidoMaterialesCalidad, IPedidoMaterialesCalidad>(
    `PedidoMaterialesCalidad/PostRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.postRequest(modelo), info);
    }
  );
  putRequest = createAsyncThunk<boolean, IPedidoMaterialesCalidad>(
    `PedidoMaterialesCalidad/PutRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.putRequest(modelo), info);
    }
  );
}
export const PedidoMaterialesCalidadSliceRequests = new PedidoMaterialesCalidadClassSlice(controlLoteService);

const initialState: IIniState<IPedidoMaterialesCalidad> = {
  loading: null,
  data: null
};

export const PedidoMaterialesCalidadSlice = createSlice({
  name: "PedidoMaterialesCalidad",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    // builder.addCase(PedidoMaterialesCalidadSliceRequests.multiPostRequest.fulfilled, (state, action) => {
    //   state.loading = "fulfilled";
    //   state.data = action.payload;
    // });
    // builder.addCase(PedidoMaterialesCalidadSliceRequests.multiPostRequest.rejected, (state, action) => {
    //   state.loading = "rejected";
    // });
    builder.addCase(
      PedidoMaterialesCalidadSliceRequests.getAllPedidoMaterialesCalidadRequest.fulfilled,
      (state, action) => {
        state.loading = "fulfilled";
        state.data = action.payload;
      }
    );
    builder.addCase(
      PedidoMaterialesCalidadSliceRequests.getAllPedidoMaterialesCalidadRequest.rejected,
      (state, action) => {
        state.loading = "rejected";
      }
    );
    builder.addCase(PedidoMaterialesCalidadSliceRequests.postRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PedidoMaterialesCalidadSliceRequests.postRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PedidoMaterialesCalidadSliceRequests.putRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PedidoMaterialesCalidadSliceRequests.putRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
