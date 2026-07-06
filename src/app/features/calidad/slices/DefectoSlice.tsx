import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models";
import { IDefecto } from "app/models/IDefecto";
import { DefectoService } from "app/features/calidad/services/defecto.service";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const defectoService = new DefectoService();
class DefectoClass {
  url = "Defecto";
  constructor(private service: DefectoService) {}
  GetAllRequest = createAsyncThunk<IDefecto[]>(`${this.url}/getAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.getAll(), thunk);
  });
  PostRequest = createAsyncThunk<boolean, IDefecto>(`${this.url}/Post`, async (entity, info) => {
    return await errorNotification(() => this.service.postRequest(entity), info);
  });
  PutRequest = createAsyncThunk<boolean, IDefecto>(`${this.url}/Put`, async (entity, info) => {
    return await errorNotification(() => this.service.putRequest(entity), info);
  });
  DeleteRequest = createAsyncThunk<boolean, number>(`${this.url}/Delete`, async (id, info) => {
    return await errorNotification(() => this.service.deleteRequest(id), info);
  });
  GetAllByCodRep = createAsyncThunk<IDefecto[], number>(`${this.url}/GetAllByCodRep`, async (codRep, info) => {
    return await errorNotification(() => this.service.getAllByCodRep(codRep), info);
  });
}
export const DefectoSliceRequest = new DefectoClass(defectoService);
const initialState: IIniState<IDefecto> = {
  dataAll: [],
  loading: null,
  data: null,
  object: null
};
export const DefectoSlice = createSlice({
  initialState,
  reducers: {},
  name: "defecto",
  extraReducers(builder) {
    builder.addCase(DefectoSliceRequest.GetAllRequest.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(DefectoSliceRequest.GetAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(DefectoSliceRequest.GetAllByCodRep.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(DefectoSliceRequest.GetAllByCodRep.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
