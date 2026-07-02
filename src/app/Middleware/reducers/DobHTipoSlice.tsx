import { IDobHTipo } from "app/models/IDobHTipo";
import { DobHTipoService } from "app/services/dobHTipo.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const dobHTipoService = new DobHTipoService();
class dobHTipoClassSlice extends GenericSlice<IDobHTipo> {
  constructor(private service: DobHTipoService) {
    super("DobHTipo", service);
  }
  //nuevos asyncthunks aqui
}
export const DobHTipoSliceRequests = new dobHTipoClassSlice(dobHTipoService);

const initialState: IIniState<IDobHTipo> = {
  loading: null,
  data: null
};

export const dobHTipoSlice = createSlice({
  name: "DobHTipo",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobHTipoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
