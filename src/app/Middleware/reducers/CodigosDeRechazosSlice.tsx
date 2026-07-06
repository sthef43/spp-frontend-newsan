import { IIniState } from "app/models/IIniState";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { ICodigosDeRechazos } from "app/models/ICodigosDeRechazos";
import { CodigosDeRechazosService } from "app/services/codigosDeRechazos.service";
const codigosDeRechazosService = new CodigosDeRechazosService();
class codigosDeRechazosClassSlice extends GenericSlice<ICodigosDeRechazos> {
  constructor(private service: CodigosDeRechazosService) {
    super("CodigosDeRechazos", service);
  }
  //nuevos asyncthunks aqui
}
export const CodigosDeRechazosSliceRequests = new codigosDeRechazosClassSlice(codigosDeRechazosService);

const initialState: IIniState<ICodigosDeRechazos> = {
  loading: null,
  data: null
};

export const codigosDeRechazosSlice = createSlice({
  name: "CodigosDeRechazos",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    CodigosDeRechazosSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
