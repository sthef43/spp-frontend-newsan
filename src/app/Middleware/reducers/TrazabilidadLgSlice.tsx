import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { TrazabilidadLgService } from "app/services/trazabilidadLg.service";
import { ITrazabilidadLg } from "app/models/ITrazabilidadLg";

const trazabilidadLgService = new TrazabilidadLgService();
class trazabilidadLgClassSlice {
  constructor(private service: TrazabilidadLgService) {}
  getByNroSrv = createAsyncThunk<ITrazabilidadLg, string>(`TrazabilidadLg/GetByNroSrv`, async (nroSrv, info) => {
    console.log(nroSrv);
    return await errorNotification(() => this.service.getByNroSrv(nroSrv), info);
  });
  getByTrazabilidad = createAsyncThunk<ITrazabilidadLg, string>(
    `TrazabilidadLg/GetByTrazabilidad`,
    async (trazabilidad, info) => {
      return await errorNotification(() => this.service.getByTrazabilidad(trazabilidad), info);
    }
  );
  DeleteByIdRequest = createAsyncThunk<boolean, number>(
    `Inicio/DeleteById`,
    async (lista, info) => {
      return await errorNotification(() => this.service.DeleteById(lista), info);
    }
  );
  //nuevos asyncthunks aqui
}
export const TrazabilidadLgSliceRequests = new trazabilidadLgClassSlice(trazabilidadLgService);

const initialState: IIniState<ITrazabilidadLg> = {
  loading: null,
  data: null
};

export const TrazabilidadLgSlice = createSlice({
  name: "TrazabilidadLg",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //nuevos manejos de asyncthunk aqui
    builder.addCase(TrazabilidadLgSliceRequests.getByNroSrv.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload as any;
    });
    builder.addCase(TrazabilidadLgSliceRequests.getByNroSrv.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
