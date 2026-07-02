import { IIntEstado } from "app/models/IIntEstado";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { IntEstadoService } from "app/services/intEstado.service";

const intEstadoService = new IntEstadoService();
class intEstadoClassSlice extends GenericSlice<IIntEstado> {
  constructor(private service: IntEstadoService) {
    super("IntEstado", service);
  }
  //nuevos asyncthunks aqui
}
export const IntEstadoSliceRequests = new intEstadoClassSlice(intEstadoService);

const initialState: IIniState<IIntEstado> = {
  loading: null,
  data: null
};

export const intEstadoSlice = createSlice({
  name: "IntEstado",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    IntEstadoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});