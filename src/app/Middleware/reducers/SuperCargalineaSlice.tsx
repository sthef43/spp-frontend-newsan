import { ISuperCargalinea } from "app/models/ISuperCargalinea";

import { IIniState } from "app/models/IIniState";
import { SuperCargalineaService } from "app/services/superCargalinea.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const superCargalineaService = new SuperCargalineaService();

class SuperCargalineaClassSlice {
  constructor(private service: SuperCargalineaService) {}
  //Nuevos endpoints que no heredan de generic
  getByNumeroOp = createAsyncThunk<ISuperCargalinea[], string>(
    `SuperCargalinea/GetByNumeroOp`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getByNumeroOpRequest(modelo), info);
    }
  );
  getGroupedByModeloOp = createAsyncThunk<ISuperCargalinea[], string>(
    `SuperCargalinea/getGroupedByModeloOp`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getGroupedByModeloOp(), info);
    }
  );
  getMateriales = createAsyncThunk<ISuperCargalinea[], string>(
    `SuperCargalinea/getMateriales`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getMateriales(), info);
    }
  );
  getByModeloRequest = createAsyncThunk<ISuperCargalinea[], string>(
    `SuperCargalinea/GetByModelo`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getByModelo(modelo), info);
    }
  );
  multiPostNestedRequest = createAsyncThunk<boolean, ISuperCargalinea[]>(
    `SuperCargalinea/MultiPostNested`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.MultiPostNested(modelo), info);
    }
  );
  postRequest = createAsyncThunk<boolean, ISuperCargalinea>(`SuperCargalinea`, async (modelo, info) => {
    return await errorNotification(() => this.service.Post(modelo), info);
  });
  putRequest = createAsyncThunk<boolean, ISuperCargalinea>(`SuperCargalinea`, async (modelo, info) => {
    return await errorNotification(() => this.service.Put(modelo), info);
  });
  deleteRequest = createAsyncThunk<boolean, number>(`SuperCargalinea/Deleted`, async (id, info) => {
    return await errorNotification(() => this.service.Deleted(id), info);
  });
  multiDeleteRequest = createAsyncThunk<boolean, ISuperCargalinea[]>(
    "SuperCargalinea/MultiDelete",
    async (entity, info) => {
      return await errorNotification(() => this.service.MultiDeleteRequest(entity), info);
    }
  );
}
export const SuperCargalineaSliceRequests = new SuperCargalineaClassSlice(superCargalineaService);

const initialState: IIniState<ISuperCargalinea> = {
  loading: null,
  data: null,
  dataAll: null,
  object: {}
};

export const SuperCargalineaSlice = createSlice({
  name: "SuperCargalinea",
  initialState: initialState,
  reducers: {
    clearData: (state) => {
      state.data = null;
      state.dataAll = null;
      state.loading = null;
    }
  },
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic

    builder.addCase(SuperCargalineaSliceRequests.getByNumeroOp.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(SuperCargalineaSliceRequests.getByNumeroOp.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(SuperCargalineaSliceRequests.getGroupedByModeloOp.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(SuperCargalineaSliceRequests.getGroupedByModeloOp.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(SuperCargalineaSliceRequests.getMateriales.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(SuperCargalineaSliceRequests.getMateriales.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(SuperCargalineaSliceRequests.getByModeloRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(SuperCargalineaSliceRequests.getByModeloRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
