import { createSlice } from "@reduxjs/toolkit";
import { IIniState } from "app/models/IIniState";
import { GenericSliceMes } from "./genericSliceMes";
import { FactoriesService } from "app/services/mes/factories.service";
import { IFactories } from "app/models/mes/IFactories";

const factoriesService = new FactoriesService();
class factoriesClassSlice extends GenericSliceMes<IFactories> {
  constructor(private service: FactoriesService) {
    super("Factories", service);
  }
  //nuevos asyncthunks aqui
}
export const FactoriesSliceRequests = new factoriesClassSlice(factoriesService);

const initialState: IIniState<IFactories> = {
  loading: null,
  data: null
};

export const factoriesSlice = createSlice({
  name: "Factories",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    FactoriesSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
  }
});
