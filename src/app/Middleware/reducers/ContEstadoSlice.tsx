import { IContEstado } from "app/models/IContEstado";
import { ContEstadoService } from "app/services/contEstado.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const contEstadoService = new ContEstadoService();
class contEstadoClassSlice extends GenericSlice<IContEstado> {
  constructor(private service: ContEstadoService) {
    super("ContEstado", service);
  }
  //nuevos asyncthunks aqui
}
export const ContEstadoSliceRequests = new contEstadoClassSlice(contEstadoService);

const initialState: IIniState<IContEstado> = {
  loading: null,
  data: null
};

export const contEstadoSlice = createSlice({
  name: "ContEstado",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ContEstadoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
