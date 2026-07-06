import { IContObservacion } from "app/models/IContObservacion";
import { ContObservacionService } from "app/services/contObservacion.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const contObservacionService = new ContObservacionService();
class contObservacionClassSlice extends GenericSlice<IContObservacion> {
  constructor(private service: ContObservacionService) {
    super("ContObservacion", service);
  }
  //nuevos asyncthunks aqui
}
export const ContObservacionSliceRequests = new contObservacionClassSlice(contObservacionService);

const initialState: IIniState<IContObservacion> = {
  loading: null,
  data: null
};

export const contObservacionSlice = createSlice({
  name: "ContObservacion",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ContObservacionSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
