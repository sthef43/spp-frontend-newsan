import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { CajaElectricaLGService } from "app/features/calidad/services/cajaElectricaLG.service";
import { IcajaElectricaLG } from "app/models/IcajaElectricaLG";
//<IAuth, IAuthUser>
const cajaElectricaLGService = new CajaElectricaLGService();

class CajaElectricaLGClassSlice {
  constructor(private service: CajaElectricaLGService) {}
  //Nuevos endpoints que no heredan de generic
  getAllRequest = createAsyncThunk<IcajaElectricaLG[]>(`cajaElectricaLG/GetAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.getAllRequest(), thunk);
  });
  getAllByCodigo = createAsyncThunk<IcajaElectricaLG[], string>(
    `cajaElectricaLG/GetAllByCodigo`,
    async (codigo, info) => {
      return await errorNotification(() => this.service.getAllByCodigo(codigo), info);
    }
  );
}
export const CajaElectricaLGSliceRequests = new CajaElectricaLGClassSlice(cajaElectricaLGService);

const initialState: IIniState<IcajaElectricaLG> = {
  loading: null,
  dataAll: [],
  data: null
};

export const CajaElectricaLGSlice = createSlice({
  name: "cajaElectricaLG",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(CajaElectricaLGSliceRequests.getAllRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(CajaElectricaLGSliceRequests.getAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(CajaElectricaLGSliceRequests.getAllByCodigo.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(CajaElectricaLGSliceRequests.getAllByCodigo.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
