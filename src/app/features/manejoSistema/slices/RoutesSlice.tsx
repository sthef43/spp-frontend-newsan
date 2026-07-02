import { IRoutes } from "app/models/IRoutes";
import { RoutesService } from "app/features/manejoSistema/services/routes.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "../../../Middleware/reducers/genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../../../Middleware/HelperMidleware/errorNotifications";

const routesService = new RoutesService();
class routesClassSlice extends GenericSlice<IRoutes> {
  constructor(private service: RoutesService) {
    super("Routes", service);
  }
  //nuevos asyncthunks aqui
  GetRoutesByFatherName = createAsyncThunk<IRoutes[], { nombrePadre; permisoId }>(
    `Routes/GetRoutesByFatherName`,
    async ({ nombrePadre, permisoId }, info) => {
      return await errorNotification(() => this.service.GetRoutesByFatherName(nombrePadre, permisoId), info);
    }
  );
}
export const RoutesSliceRequests = new routesClassSlice(routesService);

const initialState: IIniState<IRoutes> = {
  loading: null,
  data: null
};

export const routesSlice = createSlice({
  name: "Routes",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    RoutesSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
