import { IDobTipoAA } from "app/models/IDobTipoAA";
import { DobTipoAAService } from "app/services/dobTipoAA.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const dobTipoAAService = new DobTipoAAService();
class dobTipoAAClassSlice extends GenericSlice<IDobTipoAA> {
  constructor(private service: DobTipoAAService) {
    super("DobTipoAA", service);
  }
  //nuevos asyncthunks aqui
}
export const DobTipoAASliceRequests = new dobTipoAAClassSlice(dobTipoAAService);

const initialState: IIniState<IDobTipoAA> = {
  loading: null,
  data: null
};

export const dobTipoAASlice = createSlice({
  name: "DobTipoAA",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobTipoAASliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
