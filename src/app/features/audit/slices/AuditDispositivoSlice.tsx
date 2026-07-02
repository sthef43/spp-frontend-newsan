import { IAuditDispositivo } from "app/models/IAuditDispositivo";
import { IIniState } from "app/models/IIniState";
import { AuditDispositivoService } from "app/services/auditDispositivo.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../../../Middleware/HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
const auditDispositivoService = new AuditDispositivoService();
class AuditDispositivoClassSlice extends GenericSlice<IAuditDispositivo> {
  constructor(private service: AuditDispositivoService) {
    super("AuditDispositivo", service);
  }
  GetbyTableAndCodigo = createAsyncThunk<IAuditDispositivo, { table: number; codigo: string }>(
    `AuditDispositivo/GetbyTableAndCodigo`,

    async (data, info) => {
      return await errorNotification(() => this.service.GetbyTableAndCodigo(data.table, data.codigo), info);
    }
  );
  GetAllByPlantAndTable = createAsyncThunk<IAuditDispositivo[], { table: number; plantId: number }>(
    `AuditDispositivo/GetAllByPlantAndTable`,

    async (data, info) => {
      return await errorNotification(() => this.service.GetAllByPlantAndTable(data.table, data.plantId), info);
    }
  );
}
export const AuditDispositivoSliceRequests = new AuditDispositivoClassSlice(auditDispositivoService);

const initialState: IIniState<IAuditDispositivo> = {
  loading: null,
  dataAll: [],
  data: null
};

export const AuditDispositivoSlice = createSlice({
  name: "AuditDispositivo",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    AuditDispositivoSliceRequests.builderAll(builder);
    builder.addCase(AuditDispositivoSliceRequests.GetbyTableAndCodigo.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(AuditDispositivoSliceRequests.GetbyTableAndCodigo.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AuditDispositivoSliceRequests.GetAllByPlantAndTable.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(AuditDispositivoSliceRequests.GetAllByPlantAndTable.rejected, (state, action) => {
      state.loading = "rejected";
    });
    //nuevos manejos de asyncthunk aqui
  }
});
