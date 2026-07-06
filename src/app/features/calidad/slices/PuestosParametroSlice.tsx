import { IIniState } from "app/models/IIniState";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";

import { PuestosParametroService } from "app/services/puestosParametro.service";
import { IPuestosParametro } from "app/models/IPuestosParametro";

const puestosParametroService = new PuestosParametroService();
class puestosParametroClassSlice extends GenericSlice<IPuestosParametro> {
  constructor(private service: PuestosParametroService) {
    super("PuestosParametro", service);
  }
  //nuevos asyncthunks aqui
}
export const PuestosParametroSliceRequests = new puestosParametroClassSlice(puestosParametroService);

const initialState: IIniState<IPuestosParametro> = {
  loading: null,
  data: null
};

export const puestosParametroSlice = createSlice({
  name: "PuestosParametro",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    PuestosParametroSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
