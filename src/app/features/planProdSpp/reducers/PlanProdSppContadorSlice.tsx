import { createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { PlanProdSppContadorService } from "../services/PlanProdSppContador.service";
import { IPlanProdSppContador } from "../models/IPlanProdSppContador";

const planProdSppContadorService = new PlanProdSppContadorService();

class PlanProdSppContadorClassSlice extends GenericSlice<IPlanProdSppContador> {
  constructor(private service: PlanProdSppContadorService) {
    super("PlanProdSppContador", service);
  }
}

export const PlanProdSppContadorSliceRequest = new PlanProdSppContadorClassSlice(planProdSppContadorService);

const inititalState: IIniState<IPlanProdSppContador> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const PlanProdSppContadorSlice = createSlice({
  name: "PlanProdSppContadorSlice",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    PlanProdSppContadorSliceRequest.builderAll(builder);
  }
});
