/* eslint-disable unused-imports/no-unused-vars */
import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IModelo } from "app/models/IModelo";
import { ModeloService } from "app/services/modelo.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";
const modeloService = new ModeloService();
class modeloClassSlice extends GenericSlice<IModelo> {
  constructor(private service: ModeloService) {
    super("Modelo", service);
  }
  //nuevos asyncthunks aqui
  getAllByFamiliaId = createAsyncThunk<IModelo[], number>(`Modelo/GetAllByFamiliaId`, async (familiaId, info) => {
    return await errorNotification(() => this.service.getAllByFamiliaId(familiaId), info);
  });
  getAllByNombre = createAsyncThunk<IModelo[], string>(`Modelo/GetAllByNombre`, async (nombre, info) => {
    return await errorNotification(() => this.service.getAllByNombre(nombre), info);
  });
  GetAllModelsByFamiliasOfLines = createAsyncThunk<IModelo[], number>(`Modelo/GetAllModelsByFamiliasOfLines`, async (lineaProduccionId, info) => {
    return await errorNotification(() => this.service.GetAllModelsByFamiliasOfLines(lineaProduccionId), info);
  });
  GetModelById = createAsyncThunk<IModelo, string>(`Modelo/GetModelById`, async (nombreModelo, info) => {
    return await errorNotification(() => this.service.GetModelById(nombreModelo), info);
  });
  GetAllModelsActivateByRenacer = createAsyncThunk<IModelo[]>(
    `Modelo/GetAllModelsActivateByRenacer`, async (_, info) => {
      return await errorNotification(() => this.service.GetAllModelsActivateByRenacer(), info)
    }
  )
}
export const ModeloSliceRequest = new modeloClassSlice(modeloService);


const initialState: IIniState<IModelo> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const modeloSlice = createSlice({
  name: "Modelo",
  initialState: initialState,
  reducers: {
    setObject: (state, payload: PayloadAction<IModelo>) => {
      state.object = payload.payload
    }
  },
  extraReducers: (builder) => {
    ModeloSliceRequest.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(ModeloSliceRequest.getAllByFamiliaId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
      state.dataAll = action.payload;
    });
    builder.addCase(ModeloSliceRequest.getAllByFamiliaId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
