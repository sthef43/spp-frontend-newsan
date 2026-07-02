import { IIniState } from "app/models/IIniState";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { Hoja0Service } from "app/services/hoja0.service";
import { IHoja0 } from "app/models/IHoja0";
const hoja0Service = new Hoja0Service();
class Hoja0ClassSlice extends GenericSlice<IHoja0> {
  constructor(private service: Hoja0Service) {
    super("Hoja0", service);
  }
  //nuevos asyncthunks aqui
}
export const Hoja0SliceRequest = new Hoja0ClassSlice(hoja0Service);

const initialState: IIniState<IHoja0> = {
  loading: null,
  data: null
};

export const itemSlice = createSlice({
  name: "Hoja0",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    Hoja0SliceRequest.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
