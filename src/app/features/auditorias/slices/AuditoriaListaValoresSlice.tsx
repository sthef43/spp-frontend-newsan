/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditoriaListaValores } from "../models/IAuditoriaListaValores";
import { AuditoriaListaValoresService } from "../services/AuditoriaListaValores.service";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { IAuditoriaValores } from "../models/IAuditoriaValores";
import { ListaValoresRenderizadoDTO } from "../models/DTO/ListaValoresRenderizadoDTO";
import { IAddInitialStates } from "../models/utils/IAddInitialStates";

const service = new AuditoriaListaValoresService();

class AuditoriaListaValoresClassSlice extends GenericSlice<IAuditoriaListaValores> {
  constructor(private service: AuditoriaListaValoresService) {
    super("AuditoriaListaValores", service);
  }

  GetAuditById = createAsyncThunk<IAuditoriaValores[], number>(
    `AuditoriaListaValores/GetAuditById`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAuditById(id), info);
    }
  );

  GetAllListWithValues = createAsyncThunk<IAuditoriaListaValores[], void>(
    `AuditoriaListaValores/GetAllListWithValues`,
    async (_, info) => {
      return await errorNotification(() => this.service.GetAllListWithValues(), info);
    }
  );

  GetAllListWithoutType = createAsyncThunk<IAuditoriaListaValores[], void>(
    `AuditoriaListaValores/GetAllListWithoutType`,
    async (_, info) => {
      return await errorNotification(() => this.service.GetAllListWithoutType(), info);
    }
  );

  GetAuditListWithRolId = createAsyncThunk<IAuditoriaListaValores[], number>(
    `AuditoriaListaValores/GetAuditListWithRolId`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAuditListWithRolId(id), info);
    }
  );

  GetAllListWithoutTypeAndState = createAsyncThunk<ListaValoresRenderizadoDTO, void>(
    `AuditoriaListaValores/GetAllListWithoutTypeAndState`,
    async (_, info) => {
      return await errorNotification(() => this.service.GetAllListWithoutTypeAndState(), info);
    }
  );

  GetAllAuditsByTypeAuditId = createAsyncThunk<IAuditoriaValores[], number>(
    `AuditoriaListaValores/GetAllAuditsByTypeAuditId`,
    async (id, info) => {
      return await errorNotification(() => this.service.GetAllAuditsByTypeAuditId(id), info);
    }
  );
}

export const AuditoriaListaValoresSliceRequest = new AuditoriaListaValoresClassSlice(service);

const initialState: IIniState<IAuditoriaListaValores> & IAddInitialStates<IAuditoriaValores> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null,
  dataAllValores: []
};

export const auditoriaListaValoresSlice = createSlice({
  name: "AuditoriaListaValores",
  initialState: initialState,
  reducers: {
    setDataAllValores: (state, action: PayloadAction<ListaValoresRenderizadoDTO>) => {
      state.dataAll = action.payload.listaValores;
    },
    setDataAll: (state, action: PayloadAction<IAuditoriaListaValores[]>) => {
      state.dataAll = action.payload;
    }
  },
  extraReducers: (builder) => {
    AuditoriaListaValoresSliceRequest.builderAll(builder),
      builder.addCase(AuditoriaListaValoresSliceRequest.GetAuditById.fulfilled, (state, action) => {
        state.loading = "fullfilled";
        state.dataAllValores = action.payload;
      });
    builder.addCase(AuditoriaListaValoresSliceRequest.GetAuditById.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(AuditoriaListaValoresSliceRequest.GetAllListWithoutType.fulfilled, (state, action) => {
      state.loading = "fullfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(AuditoriaListaValoresSliceRequest.GetAllListWithoutType.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(AuditoriaListaValoresSliceRequest.GetAllListWithoutType.pending, (state, _action) => {
      state.loading = "pending";
    });
    builder.addCase(AuditoriaListaValoresSliceRequest.GetAuditListWithRolId.fulfilled, (state, action) => {
      state.loading = "fullfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(AuditoriaListaValoresSliceRequest.GetAuditListWithRolId.rejected, (state, _action) => {
      state.loading = "rejected";
    });
  }
});
