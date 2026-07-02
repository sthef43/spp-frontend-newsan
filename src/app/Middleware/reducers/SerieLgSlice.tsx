import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { ISerieLg } from "app/models/ISerieLg";
import { SerieLgService } from "app/services/serieLg.service";

const serieLgService = new SerieLgService();
class serieLgClassSlice {
  constructor(private service: SerieLgService) {}
  getByNroSrv = createAsyncThunk<ISerieLg, string>(`SerieLg/GetByNroSrv`, async (nroSrv, info) => {
    return await errorNotification(() => this.service.getByNroSrv(nroSrv), info);
  });  
  ClearUsadoByTrazaRequest = createAsyncThunk<boolean, string>(`SerieLg/ClearUsadoByTraza`, async (lista, info) => {
    return await errorNotification(() => this.service.ClearUsadoByTraza(lista), info);
  });  
  getListByMGRequest = createAsyncThunk<ISerieLg[], { generico, modelo }>(
    `SerieLg/getListByMGRequest`,
    async (model, info) => {
      return await errorNotification(() => this.service.GetListByMG(model), info);
    }
  );  
  EliminarByIdRequest = createAsyncThunk<boolean, number>(
    `SerieLg/EliminarById`,
    async (number, info) => {
      return await errorNotification(() => this.service.EliminarById(number), info);
    }
  );
  putRequest = createAsyncThunk<boolean, ISerieLg>(
    `SerieLg/PutRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.putRequest(modelo), info);
    }
  );
  postRequest = createAsyncThunk<boolean, ISerieLg>(
    `SerieLg/PostRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.postRequest(modelo), info);
    }
  );
  multiPost = createAsyncThunk<boolean, ISerieLg[]>(
    `SerieLg/MultiPost`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.multiPost(modelo), info);
    }
  );
  //nuevos asyncthunks aqui
}
export const SerieLgSliceRequests = new serieLgClassSlice(serieLgService);

const initialState: IIniState<ISerieLg> = {
  loading: null,
  data: null
};

export const TrazabilidadLgSlice = createSlice({
  name: "SerieLg",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //nuevos manejos de asyncthunk aqui
    builder.addCase(SerieLgSliceRequests.getByNroSrv.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload as any;
    });
    builder.addCase(SerieLgSliceRequests.getByNroSrv.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
