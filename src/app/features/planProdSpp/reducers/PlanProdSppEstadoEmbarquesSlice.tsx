import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { PlanProdSppEstadoEmbarqueService } from "../services/PlanProdSppEstadoEmbarque.service";
import { IPlanProdSppEstadoEmbarque } from "../models/IPlanProdSppEstadoEmbarque";

const planProdSppEstadoEmbarquesService = new PlanProdSppEstadoEmbarqueService();

class PlanProdSppEstadoEmbarquesClassSlice extends GenericSlice<IPlanProdSppEstadoEmbarque> {
  constructor(private service: PlanProdSppEstadoEmbarqueService) {
    super("PlanProdSppEstadoEmbarque", service);
  }
}

export const PlanProdSppEstadoEmbarquesSliceRequest = new PlanProdSppEstadoEmbarquesClassSlice(
  planProdSppEstadoEmbarquesService
);

const inititalState: IIniState<IPlanProdSppEstadoEmbarque> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const PlanProdSppEstadoEmbarquesSlice = createSlice({
  name: "PlanProdSppEstadoEmbarque",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    PlanProdSppEstadoEmbarquesSliceRequest.builderAll(builder);
  }
});
