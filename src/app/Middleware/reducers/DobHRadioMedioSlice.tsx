import { IDobHRadioMedio } from "app/models/IDobHRadioMedio";
import { DobHRadioMedioService } from "app/services/dobHRadioMedio.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const dobHRadioMedioService = new DobHRadioMedioService();
class dobHRadioMedioClassSlice extends GenericSlice<IDobHRadioMedio> {
  constructor(private service: DobHRadioMedioService) {
    super("DobHRadioMedio", service);
  }
  //nuevos asyncthunks aqui
}
export const DobHRadioMedioSliceRequests = new dobHRadioMedioClassSlice(dobHRadioMedioService);

const initialState: IIniState<IDobHRadioMedio> = {
  loading: null,
  data: null
};

export const dobHRadioMedioSlice = createSlice({
  name: "DobHRadioMedio",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobHRadioMedioSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
