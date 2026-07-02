import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models/IIniState";
import { ICLIUbicaciones } from "../Models/ICLIUbicaciones";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { CLIUbicacionesService } from "app/features/cli/Services/cliUbicaciones.service";

const cliUbicacionesService = new CLIUbicacionesService();
class cliUbicacionesClassSlice extends GenericSlice<ICLIUbicaciones> {
  constructor(private service: CLIUbicacionesService) {
    super("CLIUbicaciones", service);
  }
  //nuevos asyncthunks aqui
  getByLocalizador = createAsyncThunk<ICLIUbicaciones[]>(`CLIUbicaciones/getByLocalizador`, async (modelo, info) => {
    return await errorNotification(() => this.service.getByLocalizador(), info);
  });
}
export const CLIUbicacionesSliceRequests = new cliUbicacionesClassSlice(cliUbicacionesService);

const initialState: IIniState<ICLIUbicaciones> = {
  loading: null,
  data: null
};

export const CLIUbicacionesSlice = createSlice({
  name: "CLIUbicaciones",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    CLIUbicacionesSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
