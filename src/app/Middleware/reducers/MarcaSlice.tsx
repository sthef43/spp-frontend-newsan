import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { MarcaService } from "app/services/marca.service";
import { IMarca } from "app/models/IMarca";

const marcaService = new MarcaService();
class marcaClassSlice extends GenericSlice<IMarca> {
  constructor(private service: MarcaService) {
    super("Marca", service);
  }
  //nuevos asyncthunks aqui
}
export const MarcaSliceRequests = new marcaClassSlice(marcaService);

const initialState: IIniState<IMarca> = {
  loading: null,
  data: null
};

export const marcaSlice = createSlice({
  name: "Marca",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    MarcaSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
