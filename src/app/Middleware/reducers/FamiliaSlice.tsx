import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IFamilia } from "app/models/IFamilia";
import { FamiliaService } from "app/services/familia.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const familiaService = new FamiliaService();
class familaClassSlice extends GenericSlice<IFamilia> {
  constructor(private service: FamiliaService) {
    super("Familia", service);
  }
  getAllByProductoId = createAsyncThunk<IFamilia[], number>(`Familia/GetAllByProductoId`, async (id, info) => {
    return await errorNotification(() => this.service.getAllByProductoId(id), info);
  });
  getListByNombreRequest = createAsyncThunk<IFamilia[], string>(`Familia/GetListByNombre`, async (tipoUnidad, info) => {
    return await errorNotification(() => this.service.getListByNombre(tipoUnidad), info);
  });
  //nuevos asyncthunks aqui
}
export const FamiliaSliceRequests = new familaClassSlice(familiaService);

const initialState: IIniState<IFamilia> = {
  loading: null,
  data: null
};

export const familiaSlice = createSlice({
  name: "Familia",
  initialState: initialState,
  reducers: {
    setObject: (state, payload: PayloadAction<IFamilia>) => {
      state.object = payload.payload
    },
    setDataAll: (state, payload: PayloadAction<IFamilia[]>) => {
      state.dataAll = payload.payload
    }
  },
  extraReducers: (builder) => {
    FamiliaSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(FamiliaSliceRequests.getAllByProductoId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(FamiliaSliceRequests.getAllByProductoId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
