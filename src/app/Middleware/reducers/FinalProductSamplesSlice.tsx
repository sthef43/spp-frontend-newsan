import { IFinalProductSamples } from "app/models/IFinalProductSamples";
import { IIniState } from "app/models/IIniState";
import { FinalProductSamplesService } from "app/services/finalProductSamples.service";
import { createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
const finalProductSamplesService = new FinalProductSamplesService();
class finalProductSamplesClassSlice extends GenericSlice<IFinalProductSamples> {
  constructor(private service: FinalProductSamplesService) {
    super("FinalProductSamples", service);
  }
  //nuevos asyncthunks aqui
}
export const FinalProductSamplesSliceRequests = new finalProductSamplesClassSlice(finalProductSamplesService);

const initialState: IIniState<IFinalProductSamples> = {
  loading: null,
  data: null
};

export const finalProductSamplesSlice = createSlice({
  name: "FinalProductSamples",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    FinalProductSamplesSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
