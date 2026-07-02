import { ISuperMercadoEtiquetas } from "app/models/ISuperMercadoEtiquetas";
import { SuperMercadoEtiquetasService } from "app/services/superMercadoEtiquetas.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const superMercadoEtiquetasService = new SuperMercadoEtiquetasService();
class superMercadoEtiquetasClassSlice extends GenericSlice<ISuperMercadoEtiquetas> {
  constructor(private service: SuperMercadoEtiquetasService) {
    super("SuperMercadoEtiquetas", service);
  }
  //nuevos asyncthunks aqui
}
export const SuperMercadoEtiquetasSliceRequests = new superMercadoEtiquetasClassSlice(superMercadoEtiquetasService);

const initialState: IIniState<ISuperMercadoEtiquetas> = {
  loading: null,
  data: null
};

export const superMercadoEtiquetasSlice = createSlice({
  name: "SuperMercadoEtiquetas",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    SuperMercadoEtiquetasSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
