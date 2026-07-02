import { IPermisos } from "app/models/IPermisos";
import { PermisosService } from "app/features/manejoSistema/services/permisos.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../../../Middleware/HelperMidleware/errorNotifications";

const permisosService = new PermisosService();
class permisosClassSlice extends GenericSlice<IPermisos> {
  constructor(private service: PermisosService) {
    super("Permisos", service);
  }
  getByRolId = createAsyncThunk<IPermisos[], number>(
    `Permisos/getByRolId`,

    async (number, info) => {
      return await errorNotification(() => this.service.getByRolId(number), info);
    }
  );
}
export const PermisosSliceRequests = new permisosClassSlice(permisosService);

const initialState: IIniState<IPermisos> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const permisosSlice = createSlice({
  name: "Permisos",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    PermisosSliceRequests.builderAll(builder);
    builder.addCase(PermisosSliceRequests.getByRolId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PermisosSliceRequests.getByRolId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    //nuevos manejos de asyncthunk aqui
  }
});
