import { IUbicacion } from "app/models/IUbicacion";
import { UbicacionService } from "app/services/ubicacion.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const ubicacionService = new UbicacionService();
class ubicacionClassSlice extends GenericSlice<IUbicacion> {
  constructor(private service: UbicacionService) {
    super("Ubicacion", service);
  }
  //nuevos asyncthunks aqui
}
export const UbicacionSliceRequests = new ubicacionClassSlice(ubicacionService);

const initialState: IIniState<IUbicacion> = {
  loading: null,
  data: null
};

export const ubicacionSlice = createSlice({
  name: "Ubicacion",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    UbicacionSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
