import { IIniState } from "app/models/IIniState";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { PautaIngenieriaAprobadaService } from "app/services/pautaIngenieriaAprobada.service";
import { IPautaIngenieriaAprobada } from "app/models/IPautaIngenieriaAprobada";

const pautaIngenieriaAprobadaService = new PautaIngenieriaAprobadaService();

class pautaIngenieriaAprobadaClassSlice extends GenericSlice<IPautaIngenieriaAprobada> {
  constructor(private service: PautaIngenieriaAprobadaService) {
    super("PautaIngenieriaAprobada", service);
  }
  //nuevos asyncthunks aqui
}
export const PautaIngenieriaAprobadaSliceRequest = new pautaIngenieriaAprobadaClassSlice(
  pautaIngenieriaAprobadaService
);

const initialState: IIniState<IPautaIngenieriaAprobada> = {
  loading: null,
  data: null
};

export const pautaIngenieriaAprobadaSlice = createSlice({
  name: "pautaIngenieriaAprobada",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    PautaIngenieriaAprobadaSliceRequest.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
