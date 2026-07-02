import { IDobHTipoMaquina } from "app/models/IDobHTipoMaquina";
import { DobHTipoMaquinaService } from "app/services/dobHTipoMaquina.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const dobHTipoMaquinaService = new DobHTipoMaquinaService();
class dobHTipoMaquinaClassSlice extends GenericSlice<IDobHTipoMaquina> {
  constructor(private service: DobHTipoMaquinaService) {
    super("DobHTipoMaquina", service);
  }
  //nuevos asyncthunks aqui
}
export const DobHTipoMaquinaSliceRequests = new dobHTipoMaquinaClassSlice(dobHTipoMaquinaService);

const initialState: IIniState<IDobHTipoMaquina> = {
  loading: null,
  data: null
};

export const dobHTipoMaquinaSlice = createSlice({
  name: "DobHTipoMaquina",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobHTipoMaquinaSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
