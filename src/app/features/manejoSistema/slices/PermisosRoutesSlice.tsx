import { IPermisosRoutes } from "app/models/IPermisosRoutes";
import { PermisosRoutesService } from "app/features/manejoSistema/services/permisosRoutes.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../../../Middleware/HelperMidleware/errorNotifications";
import { RutasConPadresDTO } from "app/models/DTO/RutasConPadresDTO";

const permisosRoutesService = new PermisosRoutesService();
class permisosRoutesClassSlice extends GenericSlice<IPermisosRoutes> {
  constructor(private service: PermisosRoutesService) {
    super("PermisosRoutes", service);
  }
  getAllByIdRequest = createAsyncThunk<IPermisosRoutes[], number>(
    `PermisosRoutes/getAllByIdRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getAllByPermisos(modelo), info);
    }
  );
  GetAllFathersRoutesByPermisoId = createAsyncThunk<string[], number>(
    `PermisosRoutes/GetAllFathersRoutesByPermisoId`,
    async (permisoId, info) => {
      return await errorNotification(() => this.service.GetAllFathersRoutesByPermisoId(permisoId), info);
    }
  );
  GetAllFathersWithRoutes = createAsyncThunk<RutasConPadresDTO[], number>(
    `PermisosRoutes/GetAllFathersWithRoutes`,
    async (permisoId, info) => {
      return await errorNotification(() => this.service.GetAllFathersWithRoutes(permisoId), info);
    }
  );
}
export const PermisosRoutesSliceRequests = new permisosRoutesClassSlice(permisosRoutesService);

const initialState: IIniState<IPermisosRoutes> = {
  loading: null,
  data: null,
  dataAll: []
};

export const permisosRoutesSlice = createSlice({
  name: "PermisosRoutes",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    PermisosRoutesSliceRequests.builderAll(builder);
    builder.addCase(PermisosRoutesSliceRequests.getAllByIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
      state.dataAll = action.payload;
    });
    builder.addCase(PermisosRoutesSliceRequests.getAllByIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
