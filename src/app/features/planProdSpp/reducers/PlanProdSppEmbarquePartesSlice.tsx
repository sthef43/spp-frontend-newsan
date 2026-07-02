import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { PlanProdSppEmbarquePartesService } from "../services/PlanProdSppEmbarquePartes.service";
import { IPlanProdSppEmbarquePartes } from "../models/IPlanProdSppEmbarquePartes";

const planProdSppEmbarquePartesService = new PlanProdSppEmbarquePartesService();

class PlanProdSppEmbarquePartesClassSlice extends GenericSlice<IPlanProdSppEmbarquePartes> {
  constructor(private service: PlanProdSppEmbarquePartesService) {
    super("PlanProdSppEmbarquePartes", service);
  }
}

export const PlanProdSppEmbarquePartesSliceRequest = new PlanProdSppEmbarquePartesClassSlice(
  planProdSppEmbarquePartesService
);

const inititalState: IIniState<IPlanProdSppEmbarquePartes> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const PlanProdSppEmbarquePartesSlice = createSlice({
  name: "PlanProdSppEmbarquePartes",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    PlanProdSppEmbarquePartesSliceRequest.builderAll(builder);
  }
});
