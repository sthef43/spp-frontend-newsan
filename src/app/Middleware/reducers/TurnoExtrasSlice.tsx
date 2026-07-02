import { IIniState } from "app/models/IIniState";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { TurnoExtrasService } from "app/services/turnoExtras.service";
import { ITurnoExtras } from "app/models/ITurnoExtras";

const turnoExtrasService = new TurnoExtrasService();
class turnoExtrasClassSlice extends GenericSlice<ITurnoExtras> {
  constructor(private service: TurnoExtrasService) {
    super("TurnoExtras", service);
  }
  //nuevos asyncthunks aqui
}
export const TurnoExtrasSliceRequests = new turnoExtrasClassSlice(turnoExtrasService);

const initialState: IIniState<ITurnoExtras> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const TurnoExtrasSlice = createSlice({
  name: "TurnoExtras",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    TurnoExtrasSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
