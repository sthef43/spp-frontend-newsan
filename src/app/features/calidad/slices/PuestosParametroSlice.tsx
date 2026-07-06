import { IIniState } from "app/models/IIniState";
import { createSlice } from "@reduxjs/toolkit";
import { IPuestosParametro } from "app/models/IPuestosParametro";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { PuestosParametroService } from "../services/puestosParametro.service";

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
