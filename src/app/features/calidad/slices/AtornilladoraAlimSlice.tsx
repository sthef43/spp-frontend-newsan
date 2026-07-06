import { IAtornilladoraAlim } from "app/models";
import { IIniState } from "app/models/IIniState";
import { AtornilladoraAlimService } from "app/features/calidad/services/atornilladoraAlim.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const atornilladoraAlimService = new AtornilladoraAlimService();

class AtornilladoraAlimClassSlice {
  constructor(private service: AtornilladoraAlimService) {}
  //Nuevos endpoints que no heredan de generic
  getAllRequest = createAsyncThunk<IAtornilladoraAlim[]>(`AtornilladoraAlim/GetAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.getAllRequest(), thunk);
  });
  getByIdRequest = createAsyncThunk<IAtornilladoraAlim[], number>(`AtornilladoraAlim/GetById`, async (modelo, info) => {
    return await errorNotification(() => this.service.getByIdRequest(modelo), info);
  });
  CreateAtornilladoraAlim = createAsyncThunk<boolean, IAtornilladoraAlim>(
    `AtornilladoraAlim/CreateAtornilladoraAlim`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.create(modelo), info);
    }
  );
  UpdateAtornilladoraAlim = createAsyncThunk<boolean, IAtornilladoraAlim>(
    `AtornilladoraAlim/UpdateAtornilladoraAlim`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.update(modelo), info);
    }
  );
  deleteRequest = createAsyncThunk<boolean, number>(`AtornilladoraAlim/DeleteRequest`, async (number, info) => {
    return await errorNotification(() => this.service.deleteRequest(number), info);
  });
}
export const AtornilladoraAlimSliceRequests = new AtornilladoraAlimClassSlice(atornilladoraAlimService);

const initialState: IIniState<IAtornilladoraAlim> = {
  loading: null,
  data: null
};

export const AtornilladoraAlimSlice = createSlice({
  name: "AtornilladoraAlim",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(AtornilladoraAlimSliceRequests.getAllRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(AtornilladoraAlimSliceRequests.getAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AtornilladoraAlimSliceRequests.getByIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(AtornilladoraAlimSliceRequests.getByIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AtornilladoraAlimSliceRequests.CreateAtornilladoraAlim.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(AtornilladoraAlimSliceRequests.CreateAtornilladoraAlim.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AtornilladoraAlimSliceRequests.UpdateAtornilladoraAlim.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(AtornilladoraAlimSliceRequests.UpdateAtornilladoraAlim.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AtornilladoraAlimSliceRequests.deleteRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(AtornilladoraAlimSliceRequests.deleteRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
