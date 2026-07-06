import { IContUbicacion } from "app/models/IContUbicacion";
import { ContUbicacionService } from "app/services/contUbicacion.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const contUbicacionService = new ContUbicacionService();
class contUbicacionClassSlice extends GenericSlice<IContUbicacion> {
  constructor(private service: ContUbicacionService) {
    super("ContUbicacion", service);
  }
  //nuevos asyncthunks aqui
}
export const ContUbicacionSliceRequests = new contUbicacionClassSlice(contUbicacionService);

const initialState: IIniState<IContUbicacion> = {
  loading: null,
  data: null
};

export const contUbicacionSlice = createSlice({
  name: "ContUbicacion",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ContUbicacionSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
