import { IPlanProdMateriales } from "app/models/IPlanProdMateriales";

import { IIniState } from "app/models/IIniState";
import { PlanProdMaterialesService } from "app/services/planProdMateriales.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const planProdService = new PlanProdMaterialesService();

interface prop {
  modeloA: string;
  modeloB: string;
}

class PlanProdMaterialesClassSlice {
  constructor(private service: PlanProdMaterialesService) {}
  //Nuevos endpoints que no heredan de generic
  postRequest = createAsyncThunk<IPlanProdMateriales, IPlanProdMateriales>(
    `PlanProdMateriales/PostRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.postRequest(modelo), info);
    }
  );

  multiPostRequest = createAsyncThunk<boolean, IPlanProdMateriales[]>(
    `PlanProdMateriales/MultiPostRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.multiPostRequest(modelo), info);
    }
  );
  getMaterialesByIdPlanProd = createAsyncThunk<IPlanProdMateriales[], number>(
    `PlanProdMateriales/GetMaterialesByIdPlanProd`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getMaterialesByIdPlanProd(modelo), info);
    }
  );
  PutRequest = createAsyncThunk<boolean, IPlanProdMateriales>(
    `PlanProdMateriales`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.PutRequest(modelo), info);
    }
  );
  deleteRequest = createAsyncThunk<boolean, number>(
    `PlanProdMateriales`,

    async (number, info) => {
      return await errorNotification(() => this.service.DeleteRequest(number), info);
    }
  );
}
export const PlanProdMaterialesSliceRequests = new PlanProdMaterialesClassSlice(planProdService);

const initialState: IIniState<IPlanProdMateriales> = {
  loading: null,
  data: null
};

export const PlanProdMaterialesSlice = createSlice({
  name: "PlanProdMateriales",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(PlanProdMaterialesSliceRequests.postRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlanProdMaterialesSliceRequests.postRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PlanProdMaterialesSliceRequests.multiPostRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlanProdMaterialesSliceRequests.multiPostRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PlanProdMaterialesSliceRequests.PutRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlanProdMaterialesSliceRequests.PutRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PlanProdMaterialesSliceRequests.deleteRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlanProdMaterialesSliceRequests.deleteRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
