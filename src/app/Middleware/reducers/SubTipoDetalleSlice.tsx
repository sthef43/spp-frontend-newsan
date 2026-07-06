import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { ISubTipoDetalle } from "app/models/ISubTipoDetalle";
import { SubTipoDetalleService } from "app/services/SubTipoDetalle.service";
import { createSlice } from "@reduxjs/toolkit";

const subTipoDetalleService = new SubTipoDetalleService();
class subTipoDetalleClassService extends GenericSlice<ISubTipoDetalle> {
  constructor(private service: SubTipoDetalleService) {
    super("SubTipoDetalle", service);
  }
  //nuevos asyncthunks aqui
}
export const SubTipoDetalleSliceRequests = new subTipoDetalleClassService(subTipoDetalleService);

const initialState: IIniState<ISubTipoDetalle> = {
  loading: null,
  data: null
};

export const subTipoDetalleSlice = createSlice({
  name: "SubTipoDetalle",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    SubTipoDetalleSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
