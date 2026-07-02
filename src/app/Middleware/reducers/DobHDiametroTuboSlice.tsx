import { IDobHDiametroTubo } from "app/models/IDobHDiametroTubo";
import { DobHDiametroTuboService } from "app/services/dobHDiametroTubo.service";
import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";

const dobHDiametroTuboService = new DobHDiametroTuboService();
class dobHDiametroTuboClassSlice extends GenericSlice<IDobHDiametroTubo> {
  constructor(private service: DobHDiametroTuboService) {
    super("DobHDiametroTubo", service);
  }
  //nuevos asyncthunks aqui
}
export const DobHDiametroTuboSliceRequests = new dobHDiametroTuboClassSlice(dobHDiametroTuboService);

const initialState: IIniState<IDobHDiametroTubo> = {
  loading: null,
  data: null
};

export const dobHDiametroTuboSlice = createSlice({
  name: "DobHDiametroTubo",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    DobHDiametroTuboSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
