import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IGrupoFalla } from "../Models/IGrupoFalla";
import { GrupoFallaService } from "../Services/grupoFalla.service";

const grupoFallaService = new GrupoFallaService();

/**
 * Slice de Redux para gestionar el catálogo de Grupos de Falla.
 * Hereda las funcionalidades CRUD básicas de GenericSlice.
 */
class GrupoFallaClassSlice extends GenericSlice<IGrupoFalla> {
  constructor(private service: GrupoFallaService) {
    super("GrupoFalla", service);
  }
}

export const GrupoFallaSliceRequest = new GrupoFallaClassSlice(grupoFallaService);

const inititalState: IIniState<IGrupoFalla> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const GrupoFallaSlice = createSlice({
  name: "GrupoFalla",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    GrupoFallaSliceRequest.builderAll(builder);
  }
});
