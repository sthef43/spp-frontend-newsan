import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { EmbarquesPlanProdIdDTO } from "../models/DTOS/EmbarquesPlanProdIdDTO";
import { PlanProdSppEmbarqueBloqueService } from "../services/PlanProdSppEmbarqueBloque.service";
import { IPlanProdSpp } from "../models/IPlanProdSpp";
import { IPlanProdSppEmbarque } from "../models/IPlanProdSppEmbarque";
import { IPlanProdSppEmbarquesBloque } from "../models/IPlanProdSppEmbarqueBloque";

const planProdSppEmbarqueBloqueService = new PlanProdSppEmbarqueBloqueService();

class PlanProdSppEmbarqueBloqueClassSlice extends GenericSlice<IPlanProdSppEmbarquesBloque> {
  constructor(private service: PlanProdSppEmbarqueBloqueService) {
    super("PlanProdSppEmbarqueBloque", service);
  }

  AssignShipmentsToPlans = createAsyncThunk<IPlanProdSppEmbarquesBloque[], IPlanProdSpp[]>(
    `PlanProdSppEmbarqueBloque/AssignShipmentsToPlans`,
    async (planes, info) => {
      return await errorNotification(() => this.service.AssignShipmentsToPlans(planes), info);
    }
  );

  GenerateShipments = createAsyncThunk<IPlanProdSppEmbarque[], EmbarquesPlanProdIdDTO>(
    `PlanProdSppEmbarque/GenerateShipments`,
    async (multisId, info) => {
      return await errorNotification(() => this.service.GenerateShipments(multisId), info);
    }
  );
}

export const PlanProdSppEmbarqueBloqueSliceRequest = new PlanProdSppEmbarqueBloqueClassSlice(
  planProdSppEmbarqueBloqueService
);

const inititalState: IIniState<IPlanProdSppEmbarquesBloque> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const PlanProdSppEmbarquesBloqueSlice = createSlice({
  name: "PlanProdSppEmbarquesBloque",
  initialState: inititalState,
  reducers: {},
  extraReducers: (builder) => {
    PlanProdSppEmbarqueBloqueSliceRequest.builderAll(builder);
  }
});
