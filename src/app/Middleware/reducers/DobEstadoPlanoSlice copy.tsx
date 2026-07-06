import { IDobEstadoPlano } from "app/models/IDobEstadoPlano";
import { DobEstadoPlanoService } from "app/services/dobEstadoPlano.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const dobEstadoPlanoService = new DobEstadoPlanoService();
class dobEstadoPlanoClassSlice extends GenericSlice<IDobEstadoPlano> {
  constructor(private service: DobEstadoPlanoService) {
    super("DobEstadoPlano", service);
  }
  //nuevos asyncthunks aqui
}
export const DobEstadoPlanoSliceRequests = new dobEstadoPlanoClassSlice(dobEstadoPlanoService);

const initialState: IIniState<IDobEstadoPlano> = {
  loading: null,
  data: null
};

export const dobEstadoPlanoSlice = createSlice({
  name: "DobEstadoPlano",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobEstadoPlanoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
