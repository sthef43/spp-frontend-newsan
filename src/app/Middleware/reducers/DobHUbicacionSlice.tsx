import { IDobHUbicacion } from "app/models/IDobHUbicacion";
import { DobHUbicacionService } from "app/services/dobHUbicacion.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const dobHUbicacionService = new DobHUbicacionService();
class dobHUbicacionClassSlice extends GenericSlice<IDobHUbicacion> {
  constructor(private service: DobHUbicacionService) {
    super("DobHUbicacion", service);
  }
  //nuevos asyncthunks aqui
  getListDobHUbicacion = createAsyncThunk<IDobHUbicacion[]>(`DobHUbicacion/getListDobHUbicacion`, async (modelo, info) => {
    return await errorNotification(() => this.service.getListDobHUbicacion(), info);
  });
}
export const DobHUbicacionSliceRequests = new dobHUbicacionClassSlice(dobHUbicacionService);

const initialState: IIniState<IDobHUbicacion> = {
  loading: null,
  data: null
};

export const dobHUbicacionSlice = createSlice({
  name: "DobHUbicacion",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobHUbicacionSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
