import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { DefectoImagenService } from "app/features/calidad/services/defectoImagen.service";
import { IDefectoImagen } from "app/models/IDefectoImagen";

const defectoImagenService = new DefectoImagenService();
class DefectoImagenClass {
  url = "DefectoImagen";
  constructor(private service: DefectoImagenService) {}
  PostRequest = createAsyncThunk<IDefectoImagen, IDefectoImagen>(`${this.url}/Post`, async (entity, info) => {
    return await errorNotification(() => this.service.postRequest(entity), info);
  });
  MultiPostRequest = createAsyncThunk<boolean, IDefectoImagen[]>(`${this.url}/MultiPostRequest`, async (entity, info) => {
    return await errorNotification(() => this.service.MultiPostRequest(entity), info);
  });
  PutRequest = createAsyncThunk<IDefectoImagen, IDefectoImagen>(`${this.url}/Put`, async (entity, info) => {
    return await errorNotification(() => this.service.putRequest(entity), info);
  });
  DeleteRequest = createAsyncThunk<boolean, number>(`${this.url}/Delete`, async (id, info) => {
    return await errorNotification(() => this.service.deleteRequest(id), info);
  });
  multiDeleteRequest = createAsyncThunk<boolean, IDefectoImagen[]>(`${this.url}/deleteMultiRequest`, async (entity, info) => {
    return await errorNotification(() => this.service.deleteMultiRequest(entity), info);
  });
  GetAllByFamilia = createAsyncThunk<IDefectoImagen[], string>(`${this.url}/GetAllByCodRep`, async (familia, info) => {
    return await errorNotification(() => this.service.getAllByFamilia(familia), info);
  });
}
export const DefectoImagenSliceRequest = new DefectoImagenClass(defectoImagenService);
const initialState: IIniState<IDefectoImagen> = {
  dataAll: [],
  loading: null,
  data: null,
  object: null
};
export const DefectoImagenSlice = createSlice({
  initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IDefectoImagen>) => {
      state.object = actions.payload;
    }
  },
  name: "defectoImagen",
  extraReducers(builder) {
    builder.addCase(DefectoImagenSliceRequest.GetAllByFamilia.fulfilled, (state, action) => {
      state.dataAll = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(DefectoImagenSliceRequest.GetAllByFamilia.rejected, (state, _) => {
      state.loading = "rejected";
    });
    builder.addCase(DefectoImagenSliceRequest.PostRequest.fulfilled, (state, action) => {
      state.object = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(DefectoImagenSliceRequest.PostRequest.rejected, (state, _) => {
      state.loading = "rejected";
    });
    builder.addCase(DefectoImagenSliceRequest.MultiPostRequest.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(DefectoImagenSliceRequest.MultiPostRequest.rejected, (state, _) => {
      state.loading = "rejected";
    });
    builder.addCase(DefectoImagenSliceRequest.multiDeleteRequest.fulfilled, (state, action) => {
      state.data = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(DefectoImagenSliceRequest.multiDeleteRequest.rejected, (state, _) => {
      state.loading = "rejected";
    });
    builder.addCase(DefectoImagenSliceRequest.PutRequest.fulfilled, (state, action) => {
      state.object = action.payload;
      state.loading = "fullfiled";
    });
    builder.addCase(DefectoImagenSliceRequest.PutRequest.rejected, (state, _) => {
      state.loading = "rejected";
    });
  }
});
