import { IDobHEstado } from "app/models/IDobHEstado";
import { DobHEstadoService } from "app/services/dobHEstado.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const dobHEstadoService = new DobHEstadoService();
class dobHEstadoClassSlice extends GenericSlice<IDobHEstado> {
  constructor(private service: DobHEstadoService) {
    super("DobHEstado", service);
  }
  //nuevos asyncthunks aqui
}
export const DobHEstadoSliceRequests = new dobHEstadoClassSlice(dobHEstadoService);

const initialState: IIniState<IDobHEstado> = {
  loading: null,
  data: null
};

export const dobHEstadoSlice = createSlice({
  name: "DobHEstado",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobHEstadoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
