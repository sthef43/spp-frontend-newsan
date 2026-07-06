import { IContDetalleContenedor } from "app/models/IContDetalleContenedor";
import { ContDetalleContenedorService } from "app/services/contDetalleContenedor.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const contDetalleContenedorService = new ContDetalleContenedorService();
class contDetalleContenedorClassSlice extends GenericSlice<IContDetalleContenedor> {
  constructor(private service: ContDetalleContenedorService) {
    super("ContDetalleContenedor", service);
  }
  //nuevos asyncthunks aqui
}
export const ContDetalleContenedorSliceRequests = new contDetalleContenedorClassSlice(contDetalleContenedorService);

const initialState: IIniState<IContDetalleContenedor> = {
  loading: null,
  data: null
};

export const contDetalleContenedorSlice = createSlice({
  name: "ContDetalleContenedor",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ContDetalleContenedorSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
