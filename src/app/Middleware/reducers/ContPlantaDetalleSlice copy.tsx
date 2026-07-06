import { IContPlantaDetalle } from "app/models/IContPlantaDetalle";
import { ContPlantaDetalleService } from "app/services/contPlantaDetalle.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const contPlantaDetalleService = new ContPlantaDetalleService();
class contPlantaDetalleClassSlice extends GenericSlice<IContPlantaDetalle> {
  constructor(private service: ContPlantaDetalleService) {
    super("ContPlantaDetalle", service);
  }
  //nuevos asyncthunks aqui
}
export const ContPlantaDetalleSliceRequests = new contPlantaDetalleClassSlice(contPlantaDetalleService);

const initialState: IIniState<IContPlantaDetalle> = {
  loading: null,
  data: null
};

export const contPlantaDetalleSlice = createSlice({
  name: "ContPlantaDetalle",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ContPlantaDetalleSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
