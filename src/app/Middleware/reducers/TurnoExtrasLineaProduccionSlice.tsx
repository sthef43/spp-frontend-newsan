import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { ITurnoExtrasLineaProduccion } from "app/models/ITurnoExtrasLineaProduccion";
import { TurnoExtrasLineaProduccionService } from "app/services/turnoExtrasLineaProduccion.service";

const turnoExtrasLineaProduccionService = new TurnoExtrasLineaProduccionService();
class turnoExtrasLineaProduccionClassSlice extends GenericSlice<ITurnoExtrasLineaProduccion> {
  constructor(private service: TurnoExtrasLineaProduccionService) {
    super("TurnoExtrasLineaProduccion", service);
  }
  //nuevos asyncthunks aqui
}
export const TurnoExtrasLineaProduccionSliceRequests = new turnoExtrasLineaProduccionClassSlice(
  turnoExtrasLineaProduccionService
);

const initialState: IIniState<ITurnoExtrasLineaProduccion> = {
  loading: null,
  data: null
};

export const turnoExtrasLineaProduccionSlice = createSlice({
  name: "TurnoExtrasLineaProduccion",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    TurnoExtrasLineaProduccionSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
