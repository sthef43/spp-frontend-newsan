import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IDU1200ensayosService } from "app/services/idu1200ensayos.service";
import { IIDU1200ensayos } from "app/models/IIDU1200ensayos";
//<IAuth, IAuthUser>
const idu1200ensayosService = new IDU1200ensayosService();

class IDU1200ensayosClassSlice {
  constructor(private service: IDU1200ensayosService) {}
  //Nuevos endpoints que no heredan de generic
  getAllRequest = createAsyncThunk<IIDU1200ensayos[]>(`IDU1200ensayos/GetAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.getAllRequest(), thunk);
  });
  getAllByCodigo = createAsyncThunk<IIDU1200ensayos[], string>(
    `IDU1200ensayos/GetAllByCodigo`,
    async (codigo, info) => {
      return await errorNotification(() => this.service.getAllByCodigo(codigo), info);
    }
  );
//public async Task<List<IDU1200ensayos>> GetLastsTen(string PAB)
  getLastsTen = createAsyncThunk<IIDU1200ensayos[], string>(
    `IDU1200ensayos/GetLastsTen`,
    async (PAB, info) => {
      return await errorNotification(() => this.service.getLastsTen(PAB), info);
    }
  );
 //public async Task<List<IDU1200ensayos>> GetLastByFamilia(string familia)
  getLastByFamilia = createAsyncThunk<IIDU1200ensayos[], string>(
    `IDU1200ensayos/GetLastByFamilia`,
    async (familia, info) => {
      return await errorNotification(() => this.service.getLastByFamilia(familia), info);
    }
  );


}
export const IDU1200ensayosSliceRequests = new IDU1200ensayosClassSlice(idu1200ensayosService);

const initialState: IIniState<IIDU1200ensayos> = {
  loading: null,
  dataAll: [],
  data: null
};

export const IDU1200ensayosSlice = createSlice({
  name: "IDU1200ensayos",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(IDU1200ensayosSliceRequests.getAllRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(IDU1200ensayosSliceRequests.getAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(IDU1200ensayosSliceRequests.getAllByCodigo.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(IDU1200ensayosSliceRequests.getAllByCodigo.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
