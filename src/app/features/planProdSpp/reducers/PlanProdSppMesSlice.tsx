import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { PlanProdSppMesService } from "../services/PlanProdSppMes.service";
import { IPlanProdSppMes } from "../models/IPlanProdSppMes";

const planProdSppMesService = new PlanProdSppMesService();

class PlanProdSppMesClassSlice extends GenericSlice<IPlanProdSppMes> {
  constructor(private service: PlanProdSppMesService) {
    super("PlanProdSppMes", service);
  }
}

export const PlanProdSppMesSliceRequest = new PlanProdSppMesClassSlice(planProdSppMesService);

const inititalState: IIniState<IPlanProdSppMes> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const PlanProdSppMesSlice = createSlice({
  name: "PlanProdSppMesSlices",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    PlanProdSppMesSliceRequest.builderAll(builder);
  }
});
