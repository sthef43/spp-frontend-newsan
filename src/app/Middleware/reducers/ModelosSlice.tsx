import { IModelos } from "app/models/IModelos";

import { IIniState } from "app/models/IIniState";
import { ModelosService } from "app/services/modelos.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const modelosService = new ModelosService();

interface prop {
  temporada: number;
  tipoUnidad: string;
  tipoUnidadLinea: string;
}


class ModelosClassSlice {
  constructor(private service: ModelosService) {}
  //Nuevos endpoints que no heredan de generic
  getAllByTemporadaTipoUnidadRequest = createAsyncThunk<IModelos[], prop>(
    `Modelos/GetAllByTemporadaTipoUnidad`,
    async (modelo, info) => {
      return await errorNotification(
        () =>
          this.service.getAllByTemporadaTipoUnidadRequest(modelo.temporada, modelo.tipoUnidad, modelo.tipoUnidadLinea),
        info
      );
    }
  );
  getModelosByTemporada = createAsyncThunk<IModelos[], number>(
    `Modelos/GetModelosByTemporada`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getModelosByTemporada(modelo), info);
    }
  );
  getModelosByTipoUnidad = createAsyncThunk<IModelos[], string>(
    `Modelos/GetModelosByTipoUnidad`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getModelosByTipoUnidad(modelo), info);
    }
  );

  getAllRequest = createAsyncThunk<IModelos[]>(
    `Modelos/GetAll`,

    async (x, info) => {
      return await errorNotification(() => this.service.GetAllRequest(), info);
    }
  );
  getModeloByName = createAsyncThunk<IModelos, string>(`Modelos/GetModeloByName`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetModeloByName(modelo), info);
  });
  CreateModelo = createAsyncThunk<boolean, IModelos>(`Modelos/CreateModelo`, async (modelo, info) => {
    return await errorNotification(() => this.service.create(modelo), info);
  });
  UpdateModelo = createAsyncThunk<boolean, IModelos>(`Modelos/UpdateModelo`, async (modelo, info) => {
    return await errorNotification(() => this.service.update(modelo), info);
  });
  deleteRequest = createAsyncThunk<boolean, number>(`Modelos`, async (id, info) => {
    return await errorNotification(() => this.service.delete(id), info);
  });
}
export const ModelosSliceRequests = new ModelosClassSlice(modelosService);

const initialState: IIniState<IModelos> = {
  loading: null,
  data: null
};

export const ModelosSlice = createSlice({
  name: "Modelos",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(ModelosSliceRequests.getAllByTemporadaTipoUnidadRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ModelosSliceRequests.getAllByTemporadaTipoUnidadRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ModelosSliceRequests.getModelosByTemporada.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ModelosSliceRequests.getModelosByTemporada.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ModelosSliceRequests.getAllRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(ModelosSliceRequests.getAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ModelosSliceRequests.CreateModelo.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ModelosSliceRequests.CreateModelo.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ModelosSliceRequests.UpdateModelo.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ModelosSliceRequests.UpdateModelo.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
