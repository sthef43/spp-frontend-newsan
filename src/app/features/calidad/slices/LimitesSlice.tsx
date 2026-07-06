import { ILimites } from "app/models";
import { IIniState } from "app/models/IIniState";
import { LimitesService } from "app/services/limites.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { GenericSlice } from "./genericSlice";
//<IAuth, IAuthUser>
const limitesService = new LimitesService();

class LimitesClassSlice extends GenericSlice<ILimites> {
  constructor(private service: LimitesService) {
    super("Limites", service);
  }
  //Nuevos endpoints que no heredan de generic
  CreateLimites = createAsyncThunk<boolean, ILimites>(`Limites/CreateLimites`, async (modelo, info) => {
    return await errorNotification(() => this.service.create(modelo), info);
  });
  getAllByLineaGenerico = createAsyncThunk<ILimites[], { linea: number; generico: number }>(
    `Limites/GetAllByLineaGenerico`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getAllByLineaGenerico(modelo), info);
    }
  );
  getAllByLinea = createAsyncThunk<ILimites[], { linea: number }>(`Limites/GetAllByLinea`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllByLinea(modelo), info);
  });
}
export const LimitesSliceRequests = new LimitesClassSlice(limitesService);

const initialState: IIniState<ILimites> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const LimitesSlice = createSlice({
  name: "Limites",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(LimitesSliceRequests.CreateLimites.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(LimitesSliceRequests.CreateLimites.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(LimitesSliceRequests.getAllByLinea.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(LimitesSliceRequests.getAllByLinea.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
