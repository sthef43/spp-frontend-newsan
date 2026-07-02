/* eslint-disable unused-imports/no-unused-vars */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { PlanProdEmbarquesSppListDTO } from "../models/DTOS/PlanProdEmbarquesSppListDTO";
import { PlanProdSppConEmbarquesDTO } from "../models/DTOS/PlanProdSppConEmbarquesDTO";
import { PlanProdSppEmbarqueService } from "../services/PlanProdSppEmbarque.service";
import { IPlanProdSppEmbarque } from "../models/IPlanProdSppEmbarque";

export interface Embarques<T> extends IIniState<IPlanProdSppEmbarque> {
  preCarga?: T[];
  preCargaEdit?: T[];
  cargaDTO: PlanProdSppConEmbarquesDTO[];
}

const planProdSppEmbarqueService = new PlanProdSppEmbarqueService();

class PlanProdSppEmbarqueClassSlice extends GenericSlice<IPlanProdSppEmbarque> {
  constructor(private service: PlanProdSppEmbarqueService) {
    super("PlanProdSppEmbarque", service);
  }

  GetAllShipmentByMultisIds = createAsyncThunk<PlanProdSppConEmbarquesDTO[], number[]>(
    `PlanProdSppEmbarque/GetAllShipmentByMultisIds`,
    async (multisId, info) => {
      return await errorNotification(() => this.service.GetAllShipmentByMultisIds(multisId), info);
    }
  );

  GetAllShipmentsByPlanProdId = createAsyncThunk<IPlanProdSppEmbarque[], number>(
    `PlanProdSppEmbarque/GetAllShipmentsByPlanProdId`,
    async (planProdId, info) => {
      return await errorNotification(() => this.service.GetAllShipmentsByPlanProdId(planProdId), info);
    }
  );

  MultiPostAndComparateShipings = createAsyncThunk<IPlanProdSppEmbarque[], PlanProdEmbarquesSppListDTO[]>(
    `PlanProdSppEmbarque/MultiPostAndComparateShipings`,
    async (embarques, info) => {
      return await errorNotification(() => this.service.MultiPostAndComparateShipings(embarques), info);
    }
  );

  SearchShipmentByNumber = createAsyncThunk<IPlanProdSppEmbarque[], string>(
    `PlanProdSppEmbarque/SearchShipmentByNumber`,
    async (numeroEmbarque, info) => {
      return await errorNotification(() => this.service.SearchShipmentByNumber(numeroEmbarque), info);
    }
  );
}

export const PlanProdSppEmbarqueSliceRequest = new PlanProdSppEmbarqueClassSlice(planProdSppEmbarqueService);

const inititalState: Embarques<IPlanProdSppEmbarque> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null,
  preCarga: [],
  preCargaEdit: [],
  cargaDTO: []
};

export const PlanProdSppEmbarqueSlice = createSlice({
  name: "PlanProdSppEmbarqueSlice",
  initialState: inititalState,
  reducers: {
    setDataEmbarques: (state, action: PayloadAction<IPlanProdSppEmbarque>) => {
      state.preCarga = [...state.preCarga, action.payload];
    },
    setDeleteEmbarque: (state, action: PayloadAction<number>) => {
      state.preCarga = state.preCarga.filter((elementos) => elementos.id !== action.payload);
    },
    setEmptyPreCarga: (state) => {
      state.preCarga = [];
    },
    setDataEmbarquesList: (state, action: PayloadAction<IPlanProdSppEmbarque[]>) => {
      state.preCarga = action.payload;
    },
    setEmbarque: (state, action: PayloadAction<IPlanProdSppEmbarque>) => {
      state.object = action.payload;
    },
    setDataEbarqueEdit: (state, action: PayloadAction<IPlanProdSppEmbarque>) => {
      state.preCarga = [...state.preCargaEdit, action.payload];
    }
  },
  extraReducers: (builder) => {
    PlanProdSppEmbarqueSliceRequest.builderAll(builder),
      builder.addCase(PlanProdSppEmbarqueSliceRequest.GetAllShipmentByMultisIds.fulfilled, (state, action) => {
        state.loading = "fullfilled";
        state.cargaDTO = action.payload;
      });
    builder.addCase(PlanProdSppEmbarqueSliceRequest.GetAllShipmentByMultisIds.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
