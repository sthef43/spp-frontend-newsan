import { createAsyncThunk } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { CodigoRechazosService } from "app/services/codigoRechazos.service";
import { ICodigoRechazos } from "app/models/ICodigoRechazos";

const codigoRechazosService = new CodigoRechazosService();
class CodigoRechazosClass {
  url = "CodigoRechazos";
  constructor(private service: CodigoRechazosService) {}
  GetAllRequest = createAsyncThunk<ICodigoRechazos[]>(`${this.url}/getAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.getAll(), thunk);
  });
  PostRequest = createAsyncThunk<boolean, ICodigoRechazos>(`${this.url}/Post`, async (entity, info) => {
    return await errorNotification(() => this.service.postRequest(entity), info);
  });
  PutRequest = createAsyncThunk<boolean, ICodigoRechazos>(`${this.url}/Put`, async (entity, info) => {
    return await errorNotification(() => this.service.putRequest(entity), info);
  });
  DeleteRequest = createAsyncThunk<boolean, number>(`${this.url}/Delete`, async (id, info) => {
    return await errorNotification(() => this.service.deleteRequest(id), info);
  });
  GetByCodigoAndLineaRequest = createAsyncThunk<ICodigoRechazos, { codigo; lineaId }>(
    `${this.url}/getAll`,
    async (info, thunk) => {
      return await errorNotification(() => this.service.getListByCodigoAndLinea(info), thunk);
    }
  );
  GetListByLineaIdRequest = createAsyncThunk<ICodigoRechazos[], number>(
    `${this.url}/getListByLineaId`,
    async (info, thunk) => {
      return await errorNotification(() => this.service.getListByLineaId(info), thunk);
    }
  );
}
export const CodigoRechazosSliceRequest = new CodigoRechazosClass(codigoRechazosService);

/* const initialState: IIniState<IDefecto> = {
  dataAll: [],
  loading: null,
  data: null,
  object: null
};
export const CodigoRechazosSlice = createSlice({
  initialState,
  reducers: {},
  name: "CodigoRechazos",
  extraReducers(builder) {
    builder.addCase(CodigosDeRechazosSliceRequests.get.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(DefectoSliceRequest.GetAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
}); */
