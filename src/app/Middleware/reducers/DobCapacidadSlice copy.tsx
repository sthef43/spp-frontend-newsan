import { IDobCapacidad } from "app/models/IDobCapacidad";
import { DobCapacidadService } from "app/services/dobCapacidad.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const dobCapacidadService = new DobCapacidadService();
class dobCapacidadClassSlice extends GenericSlice<IDobCapacidad> {
  constructor(private service: DobCapacidadService) {
    super("DobCapacidad", service);
  }
  //nuevos asyncthunks aqui
}
export const DobCapacidadSliceRequests = new dobCapacidadClassSlice(dobCapacidadService);

const initialState: IIniState<IDobCapacidad> = {
  loading: null,
  data: null
};

export const dobCapacidadSlice = createSlice({
  name: "DobCapacidad",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobCapacidadSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
