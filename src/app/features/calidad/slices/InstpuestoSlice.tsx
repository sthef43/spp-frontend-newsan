import { IInstpuesto } from "app/models/IInstpuesto";
import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { InstpuestoService } from "../services/instpuesto.service";
//<IAuth, IAuthUser>
const instpuestoService = new InstpuestoService();

class InstpuestoClassSlice extends GenericSlice<IInstpuesto> {
  constructor(private service: InstpuestoService) {
    super("Instpuesto", service);
  }
  //Nuevos endpoints que no heredan de generic
  GetAllByProductoIdRequest = createAsyncThunk<IInstpuesto[], number>(
    `Instpuesto/GetAllByProductoId`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getAllByProductoId(modelo), info);
    }
  );
}
export const InstpuestoSliceRequests = new InstpuestoClassSlice(instpuestoService);

const initialState: IIniState<IInstpuesto> = {
  loading: null,
  data: null
};

export const InstpuestoSlice = createSlice({
  name: "Instpuesto",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(InstpuestoSliceRequests.getByIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(InstpuestoSliceRequests.getByIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(InstpuestoSliceRequests.GetAllByProductoIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(InstpuestoSliceRequests.GetAllByProductoIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
