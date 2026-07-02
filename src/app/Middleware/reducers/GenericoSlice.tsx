import { IGenerico } from "app/models/IGenerico";

import { IIniState } from "app/models/IIniState";
import { GenericoService } from "app/services/generico.service";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const genericoService = new GenericoService();

class GenericoClassSlice {
  constructor(private service: GenericoService) {}
  //Nuevos endpoints que no heredan de generic
  getAllByTipoUnidadRequest = createAsyncThunk<IGenerico[], string>(
    `Generico/GetByAllTipoUnidad`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getAllByTipoUnidadRequest(modelo), info);
    }
  );
  getAllRequest = createAsyncThunk<IGenerico[]>(`Generico/GetAll`, async (thunk, info) => {
    return await errorNotification(() => this.service.getAllRequest(), info);
  });

  addRequest = createAsyncThunk<boolean, IGenerico>(`Generico/Add`, async (thunk, info) => {
    return await errorNotification(() => this.service.Add(thunk), info);
  });
}
export const GenericoSliceRequests = new GenericoClassSlice(genericoService);

const initialState: IIniState<IGenerico> = {
  loading: null,
  data: null,
  dataAll: []
};

export const GenericoSlice = createSlice({
  name: "Generico",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IGenerico>) => {
      state.object = actions.payload;
    }
  },
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(GenericoSliceRequests.getAllByTipoUnidadRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(GenericoSliceRequests.getAllByTipoUnidadRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(GenericoSliceRequests.getAllRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(GenericoSliceRequests.getAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
