import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { SEH_AuditoriaServices, SP_SearchPersonal } from "../services/SEH_Auditoria.services";
import { SEH_Auditoria } from "../interfaces/SEH_Auditoria";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const sehAuditoriaService = new SEH_AuditoriaServices();

class sehAuditoriaClassSlice extends GenericSlice<SEH_Auditoria> {
  constructor(private service: SEH_AuditoriaServices) {
    super("SEH_Auditoria", service);
  }

  GetAllByDate = createAsyncThunk<SEH_Auditoria[], { planta: string; from: string; to: string }>(
    `SEHAuditoria/GetAllByDate`,

    async ({ planta, from, to }, info) => {
      return await errorNotification(() => this.service.GetAllByDate(planta, from, to), info);
    }
  );

  SearchPersonal = createAsyncThunk<SP_SearchPersonal, number>(
    `SEHAuditoria/SearchPersonal`,

    async (modelo: number, info) => {
      return await errorNotification(() => this.service.SearchPersonal(modelo), info);
    }
  );

  GetHistorialByPersonalId = createAsyncThunk<SEH_Auditoria[], number>(
    `SEHAuditoria/GetHistorialByPersonalId`,

    async (modelo: number, info) => {
      return await errorNotification(() => this.service.GetHistorialByPersonalId(modelo), info);
    }
  );

  NuevaAuditoria = createAsyncThunk<SEH_Auditoria, SEH_Auditoria>(
    `SEHAuditoria/NuevaAuditoria`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.NuevaAuditoria(modelo), info);
    }
  );
}

export const sehAuditoriaSliceRequest = new sehAuditoriaClassSlice(sehAuditoriaService);

const initialState: IIniState<SEH_Auditoria | SP_SearchPersonal> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const sehAuditoriaSlice = createSlice({
  name: "SEH_Auditoria ",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(sehAuditoriaSliceRequest.GetAllByDate.fulfilled, (state, action) => {
      state.loading = "fullfiled";
      state.data = action.payload;
    });

    builder.addCase(sehAuditoriaSliceRequest.SearchPersonal.fulfilled, (state, action) => {
      state.loading = "fullfiled";
      state.data = action.payload;
    });

    builder.addCase(sehAuditoriaSliceRequest.GetHistorialByPersonalId.fulfilled, (state, action) => {
      state.loading = "fullfiled";
      state.data = action.payload;
    });

    builder.addCase(sehAuditoriaSliceRequest.NuevaAuditoria.fulfilled, (state, action) => {
      state.loading = "fullfiled";
      state.data = action.payload;
    });

    sehAuditoriaSliceRequest.builderAll(builder);
  }
});
