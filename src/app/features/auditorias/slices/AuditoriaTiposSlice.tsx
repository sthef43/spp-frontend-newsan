import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAuditoriaTipos } from "../models/IAuditoriaTipos";
import { AuditoriaTiposService } from "../services/AuditoriaTipos.service";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const service = new AuditoriaTiposService();

class AuditoriaTiposClassSlice extends GenericSlice<IAuditoriaTipos> {
  constructor(private service: AuditoriaTiposService) {
    super("AuditoriaTipos", service);
  }

  GetAllAuditTypesByRolId = createAsyncThunk<IAuditoriaTipos[], number>(
    `AuditoriaTipos/GetAllAuditTypesByRolId`,
    async (rolId, info) => {
      return await errorNotification(() => this.service.GetAllAuditTypesByRolId(rolId), info);
    }
  );
}

export const AuditoriaTiposSliceRequest = new AuditoriaTiposClassSlice(service);

const initialState: IIniState<IAuditoriaTipos> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const auditoriaTiposSlice = createSlice({
  name: "AuditoriaTipos",
  initialState: initialState,
  reducers: {
    setListaTipos: (state, action) => {
      state.dataAll = action.payload;
    }
  },
  extraReducers: (builder) => {
    AuditoriaTiposSliceRequest.builderAll(builder);
  }
});
