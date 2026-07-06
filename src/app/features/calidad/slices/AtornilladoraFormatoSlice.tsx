import { IAtornilladoraFormato } from "app/models";
import { IIniState } from "app/models/IIniState";
import { AtornilladoraFormatoService } from "app/features/calidad/services/atornilladoraFormato.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const atornilladoraFormatoService = new AtornilladoraFormatoService();

class AtornilladoraFormatoClassSlice {
  constructor(private service: AtornilladoraFormatoService) {}
  //Nuevos endpoints que no heredan de generic
  getAllRequest = createAsyncThunk<IAtornilladoraFormato[]>(`AtornilladoraFormato/GetAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.getAllRequest(), thunk);
  });
  getByIdRequest = createAsyncThunk<IAtornilladoraFormato[], number>(
    `AtornilladoraFormato/GetById`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getByIdRequest(modelo), info);
    }
  );
  CreateAtornilladoraFormato = createAsyncThunk<boolean, IAtornilladoraFormato>(
    `AtornilladoraFormato/CreateAtornilladoraFormato`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.create(modelo), info);
    }
  );
  UpdateAtornilladoraFormato = createAsyncThunk<boolean, IAtornilladoraFormato>(
    `AtornilladoraFormato/UpdateAtornilladoraFormato`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.update(modelo), info);
    }
  );
  deleteRequest = createAsyncThunk<boolean, number>(`AtornilladoraFormato/DeleteRequest`, async (number, info) => {
    return await errorNotification(() => this.service.deleteRequest(number), info);
  });
}
export const AtornilladoraFormatoSliceRequests = new AtornilladoraFormatoClassSlice(atornilladoraFormatoService);

const initialState: IIniState<IAtornilladoraFormato> = {
  loading: null,
  data: null
};

export const AtornilladoraFormatoSlice = createSlice({
  name: "AtornilladoraFormato",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(AtornilladoraFormatoSliceRequests.getAllRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(AtornilladoraFormatoSliceRequests.getAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AtornilladoraFormatoSliceRequests.getByIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(AtornilladoraFormatoSliceRequests.getByIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AtornilladoraFormatoSliceRequests.CreateAtornilladoraFormato.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(AtornilladoraFormatoSliceRequests.CreateAtornilladoraFormato.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AtornilladoraFormatoSliceRequests.UpdateAtornilladoraFormato.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(AtornilladoraFormatoSliceRequests.UpdateAtornilladoraFormato.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(AtornilladoraFormatoSliceRequests.deleteRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(AtornilladoraFormatoSliceRequests.deleteRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
