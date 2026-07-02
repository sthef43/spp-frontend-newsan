/* eslint-disable unused-imports/no-unused-vars */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { CLIContenedorItemsRecepcionBloqService } from "app/features/cli/Services/cliContenedorItemsReceptionBloq.service";
import { ICLIContenedorItemsRecepcionBloq } from "../Models/ICLIContenedorItemsRecepcionBloq";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

export interface statesAndInitialStates<T> extends IIniState<ICLIContenedorItemsRecepcionBloq> {
  cantidadRecepciones: number;
}

const cliContenedorItemsRecepcionBloqService = new CLIContenedorItemsRecepcionBloqService();

class CLIContenedorItemsRecepcionBloqClassSlice extends GenericSlice<ICLIContenedorItemsRecepcionBloq> {
  constructor(private service: CLIContenedorItemsRecepcionBloqService) {
    super("CLIContenedorItemsRecepcionBloq", service);
  }

  GetAllReceptionByContenedorId = createAsyncThunk<ICLIContenedorItemsRecepcionBloq[], number>(
    `CLIContenedorItemsRecepcionBloq/GetAllReceptionByContenedorId`,
    async (contenedorId, info) => {
      return await errorNotification(() => this.service.GetAllReceptionByContenedorId(contenedorId), info);
    }
  );

  GetLastContainerReceived = createAsyncThunk<number, number>(
    `CLIContenedorItemsRecepcionBloq/GetLastContainerReceived`,
    async (contenedorId, info) => {
      return await errorNotification(() => this.service.GetLastContainerReceived(contenedorId), info);
    }
  );

  GetAllContainerIemsByStateReceived = createAsyncThunk<ICLIContenedorItemsRecepcionBloq[], { tipoFiltrado; sectorId }>(
    `CLIContenedorItemsRecepcionBloq/GetAllContainerIemsByStateReceived`,
    async ({ tipoFiltrado, sectorId }, info) => {
      return await errorNotification(
        () => this.service.GetAllContainerIemsByStateReceived(tipoFiltrado, sectorId),
        info
      );
    }
  );

  SearchContainerWithNotReception = createAsyncThunk<ICLIContenedorItemsRecepcionBloq, string>(
    `CLIContenedorItemsRecepcionBloq/SearchContainerWithNotReception`,
    async (lpn, info) => {
      return await errorNotification(() => this.service.SearchContainerWithNotReception(lpn), info);
    }
  );

  GetFirsBloqCreatByContenedorId = createAsyncThunk<ICLIContenedorItemsRecepcionBloq, number>(
    `CLIContenedorItemsRecepcionBloq/GetFirsBloqCreatByContenedorId`,
    async (contenedorId, info) => {
      return await errorNotification(() => this.service.GetFirsBloqCreatByContenedorId(contenedorId), info);
    }
  );

  GetContenedorBloqBySectorAndContenedorId = createAsyncThunk<
    ICLIContenedorItemsRecepcionBloq,
    { sectorId; contenedorId }
  >(
    `CLIContenedorItemsRecepcionBloq/GetContenedorBloqBySectorAndContenedorId`,
    async ({ sectorId, contenedorId }, info) => {
      return await errorNotification(
        () => this.service.GetContenedorBloqBySectorAndContenedorId(sectorId, contenedorId),
        info
      );
    }
  );

  GetAllContenedoresBloqBySectorAndContenedorId = createAsyncThunk<ICLIContenedorItemsRecepcionBloq[], number>(
    `CLIContenedorItemsRecepcionBloq/GetAllContenedoresBloqBySectorAndContenedorId`,
    async (sectorId, info) => {
      return await errorNotification(() => this.service.GetAllContenedoresBloqBySectorAndContenedorId(sectorId), info);
    }
  );

  GetAllContainerByUserWithPermissions = createAsyncThunk<ICLIContenedorItemsRecepcionBloq[], number>(
    `CLIContenedorItemsRecepcionBloq/GetAllContainerByUserWithPermissions`,
    async (usuarioId, info) => {
      return await errorNotification(() => this.service.GetAllContainerByUserWithPermissions(usuarioId), info);
    }
  );
}

export const CLIContenedorItemsRecepcionBloqSliceRequest = new CLIContenedorItemsRecepcionBloqClassSlice(
  cliContenedorItemsRecepcionBloqService
);

const inititalState: statesAndInitialStates<ICLIContenedorItemsRecepcionBloq> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null,
  cantidadRecepciones: null
};

export const CLIContenedorItemsRecepcionBloqSlice = createSlice({
  name: "CLIContenedorItemsRecepcionBloq",
  initialState: inititalState,
  reducers: {
    setObject: (state, action: PayloadAction<ICLIContenedorItemsRecepcionBloq>) => {
      state.object = action.payload;
    }
  },
  extraReducers: (builder) => {
    CLIContenedorItemsRecepcionBloqSliceRequest.builderAll(builder);
    //Nuevos slices que no heredan de generic
    builder.addCase(
      CLIContenedorItemsRecepcionBloqSliceRequest.GetAllReceptionByContenedorId.fulfilled,
      (state, action) => {
        state.dataAll = action.payload;
        state.loading = "fullfiled";
      }
    );
    builder.addCase(
      CLIContenedorItemsRecepcionBloqSliceRequest.GetAllReceptionByContenedorId.rejected,
      (state, action) => {
        state.loading = "rejected";
      }
    );
    builder.addCase(CLIContenedorItemsRecepcionBloqSliceRequest.GetLastContainerReceived.fulfilled, (state, action) => {
      state.cantidadRecepciones = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(CLIContenedorItemsRecepcionBloqSliceRequest.GetLastContainerReceived.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
