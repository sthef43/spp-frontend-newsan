import { createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models/IIniState";
import { GenericSlice } from "./genericSlice";
import { RechazoPuestoFilasService } from "app/services/rechazoPuestoFilas.service";
import { IRechazoPuestoFila } from "app/models/IRechazoPuestoFilas";
const rechazoPuestoFilasService = new RechazoPuestoFilasService();
class rechazoPuestoFilasClassSlice extends GenericSlice<IRechazoPuestoFila> {
  constructor(private service: RechazoPuestoFilasService) {
    super("RechazoPuestoFilas", service);
  }
  //nuevos asyncthunks aqui
}
export const RechazoPuestoFilasSliceRequests = new rechazoPuestoFilasClassSlice(rechazoPuestoFilasService);

const initialState: IIniState<IRechazoPuestoFila> = {
  loading: null,
  data: null,
  object: null,
  dataAll: []
};

export const RechazoPuestoFilasSlice = createSlice({
  name: "RechazoPuestoFilas",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    RechazoPuestoFilasSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
