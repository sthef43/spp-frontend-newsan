import { IDobHTipoUbicacion } from "app/models/IDobHTipoUbicacion";
import { DobHTipoUbicacionService } from "app/services/dobHTipoUbicacion.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const dobHTipoUbicacionService = new DobHTipoUbicacionService();
class dobHTipoUbicacionClassSlice extends GenericSlice<IDobHTipoUbicacion> {
  constructor(private service: DobHTipoUbicacionService) {
    super("DobHTipoUbicacion", service);
  }
  //nuevos asyncthunks aqui
}
export const DobHTipoUbicacionSliceRequests = new dobHTipoUbicacionClassSlice(dobHTipoUbicacionService);

const initialState: IIniState<IDobHTipoUbicacion> = {
  loading: null,
  data: null
};

export const dobHTipoUbicacionSlice = createSlice({
  name: "DobHTipoUbicacion",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobHTipoUbicacionSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
