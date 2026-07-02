import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { SEH_Auditoria_Detalles } from "../interfaces/SEH_Auditoria_Detalles";
import { SEH_Auditoria_DetallesServices } from "../services/SEH_Auditoria_Detalles.services";

const sehAuditoriaDetallesService = new SEH_Auditoria_DetallesServices();

class SEH_Auditoria_DetallesClassSlice extends GenericSlice<SEH_Auditoria_Detalles> {
  constructor(private service: SEH_Auditoria_DetallesServices) {
    super("SEH_Auditoria_Detalles", service);
  }
}

export const sehAuditoriaDetallesSliceRequest = new SEH_Auditoria_DetallesClassSlice(sehAuditoriaDetallesService);

const initialState: IIniState<SEH_Auditoria_Detalles> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const sehAuditoriaDetallesSlice = createSlice({
  name: "SEH_Auditoria_Detalles ",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    sehAuditoriaDetallesSliceRequest.builderAll(builder);
  }
});
