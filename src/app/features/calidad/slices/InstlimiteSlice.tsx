import { IInstlimite } from "app/models";
import { IIniState } from "app/models/IIniState";
import { InstlimiteService } from "app/features/calidad/services/instlimite.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const instlimiteService = new InstlimiteService();

class InstlimiteClassSlice {
  constructor(private service: InstlimiteService) {}
  //Nuevos endpoints que no heredan de generic
  getAllRequest = createAsyncThunk<IInstlimite[]>(`Instlimite/GetAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.getAllRequest(), thunk);
  });
  getByIdRequest = createAsyncThunk<IInstlimite[], number>(`Instlimite/GetById`, async (modelo, info) => {
    return await errorNotification(() => this.service.getByIdRequest(modelo), info);
  });
  CreateInstlimite = createAsyncThunk<boolean, IInstlimite>(`Instlimite/CreateInstlimite`, async (modelo, info) => {
    return await errorNotification(() => this.service.create(modelo), info);
  });
  UpdateInstlimite = createAsyncThunk<boolean, IInstlimite>(`Instlimite/UpdateInstlimite`, async (modelo, info) => {
    return await errorNotification(() => this.service.update(modelo), info);
  });
  deleteRequest = createAsyncThunk<boolean, number>(`Instlimite/DeleteRequest`, async (number, info) => {
    return await errorNotification(() => this.service.deleteRequest(number), info);
  });
}
export const InstlimiteSliceRequests = new InstlimiteClassSlice(instlimiteService);

const initialState: IIniState<IInstlimite> = {
  loading: null,
  data: null
};

export const InstlimiteSlice = createSlice({
  name: "Instlimite",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(InstlimiteSliceRequests.getAllRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(InstlimiteSliceRequests.getAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(InstlimiteSliceRequests.getByIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(InstlimiteSliceRequests.getByIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(InstlimiteSliceRequests.CreateInstlimite.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(InstlimiteSliceRequests.CreateInstlimite.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(InstlimiteSliceRequests.UpdateInstlimite.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(InstlimiteSliceRequests.UpdateInstlimite.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(InstlimiteSliceRequests.deleteRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(InstlimiteSliceRequests.deleteRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
