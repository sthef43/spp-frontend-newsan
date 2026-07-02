/* eslint-disable unused-imports/no-unused-vars */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Empq_declarationsService, IEMPQ_Declarations } from "app/services/empq_declarations.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IEMPQDeclarations } from "app/models/IEMPQDeclarations";
import { IIniState } from "app/models";

const empq_declarationsService = new Empq_declarationsService();

class empq_declarationsSlice {
  constructor(private service: Empq_declarationsService) { }

  postRequest = createAsyncThunk<IEMPQ_Declarations, IEMPQ_Declarations>(`empq_declarations`, async (modelo, info) => {
    return await errorNotification(() => this.service.Add(modelo), info);
  });

  getByCodigo = createAsyncThunk<IEMPQ_Declarations, string>(`empq_declarations/GetByCodigo`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetByCodigo(modelo), info);
  });

  getCountByOpRequest = createAsyncThunk<number, string>(`empq_declarations/GetCountByOp`, async (modelo, info) => {
    return await errorNotification(() => this.service.getCountByOpRequest(modelo), info);
  });
  getListByOrgOpFechaTurnoRequest = createAsyncThunk<IEMPQDeclarations[], { org; op; fecha; turno }>(
    `empq_declarations/getListByOrgOpFechaTurnoRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByOrgOpFechaTurno(modelo), info);
    }
  );
  getListByOrgOpRequest = createAsyncThunk<IEMPQDeclarations[], { org; op }>(
    `empq_declarations/getListByOrgOpRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByOrgOp(modelo), info);
    }
  );
  getListByOrgFechaTurnoRequest = createAsyncThunk<IEMPQDeclarations[], { org; fecha; turno }>(
    `empq_declarations/getListByOrgFechaTurnoRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByOrgFechaTurno(modelo), info);
    }
  );
  GetListInformeMensual = createAsyncThunk<any[], { month; year; lineaId; turno }>(
    `empq_declarations/GetListInformeMensual`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListInformeMensual(modelo), info);
    }
  );
  GetListByOrgFechaDesdeHasta = createAsyncThunk<any[], { org; fechaDesde; fechaHasta }>(
    `empq_declarations/GetListByOrgFechaDesdeHasta`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByOrgFechaDesdeHasta(modelo), info);
    }
  );
  GetListOrgFecha = createAsyncThunk<any[], { org; fechaDesde; fechaHasta }>(
    `empq_declarations/GetListOrgFecha`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListOrgFecha(modelo), info);
    }
  );
}

export const empq_declarationsSliceRequests = new empq_declarationsSlice(empq_declarationsService);

const initialState: IIniState<IEMPQDeclarations> = {
  data: null,
  loading: null,
  dataAll: [],
  object: null,
}

export const empq_declarationsSliceContext = createSlice({
  initialState: initialState,
  name: "empq_declarations",
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(empq_declarationsSliceRequests.getByCodigo.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(empq_declarationsSliceRequests.getByCodigo.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
})