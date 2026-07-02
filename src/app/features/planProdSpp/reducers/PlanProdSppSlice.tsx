/* eslint-disable unused-imports/no-unused-vars */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { ActualizarPlanProdSppDTO } from "../models/DTOS/ActualizarPlanProdSppDTO";
import { AyudaPlanificacion } from "../models/DTOS/AyudaPlanificacionDTO";
import { CambiarPosicionDTO } from "../models/DTOS/CambiarPosicionDTO";
import { IGeneratePlanProd } from "../models/DTOS/IGeneratePlanProd";
import { PlanProdSppService } from "../services/PlanProdSpp.service";
import { IPlanProdSpp } from "../models/IPlanProdSpp";

export interface optionAditional<T> extends IIniState<IPlanProdSpp> {
  planProdNew: IPlanProdSpp[];
}

const planProdSppService = new PlanProdSppService();

class PlanProdSppClassSlice extends GenericSlice<IPlanProdSpp> {
  constructor(private service: PlanProdSppService) {
    super("PlanProdSpp", service);
  }

  GetAllPlanByLineProduccionId = createAsyncThunk<IPlanProdSpp[], number>(
    `PlanProdSpp/GetAllPlanByLineProduccionId`,
    async (lineaProduccionId, info) => {
      return await errorNotification(() => this.service.GetAllPlanByLineProduccionId(lineaProduccionId), info);
    }
  );

  GetPlanByShipmentIncludes = createAsyncThunk<IPlanProdSpp, number>(
    `PlanProdSpp/GetPlanByShipmentIncludes`,
    async (planProdId, info) => {
      return await errorNotification(() => this.service.GetPlanByShipmentIncludes(planProdId), info);
    }
  );

  GetAllPlanByMonthAndLineProduccionId = createAsyncThunk<IPlanProdSpp[], { lineaProduccionId; mesInicio; mesFin }>(
    `PlanProsSpp/GetAllPlanByMonthAndLineProduccionId`,
    async ({ lineaProduccionId, mesInicio, mesFin }, info) => {
      return await errorNotification(
        () => this.service.GetAllPlanByMonthAndLineProduccionId(lineaProduccionId, mesInicio, mesFin),
        info
      );
    }
  );

  GenerateNewPlanProd = createAsyncThunk<IPlanProdSpp[], IGeneratePlanProd>(
    `PlanProdSpp/GenerateNewPlanProd`,
    async (listaModelos, info) => {
      return await errorNotification(() => this.service.GenerateNewPlanProd(listaModelos), info);
    }
  );

  PutPlanProdSpp = createAsyncThunk<IPlanProdSpp[], ActualizarPlanProdSppDTO>(
    `PlanProdSpp/PutPlanProdSpp`,
    async (entidad, info) => {
      return await errorNotification(() => this.service.PutPlanProdSpp(entidad), info);
    }
  );

  SearchPosisitonsByNumbers = createAsyncThunk<boolean, CambiarPosicionDTO>(
    `PlanProdSpp/SearchPosisitonsByNumbers`,
    async (objeto, info) => {
      return await errorNotification(() => this.service.SearchPosisitonsByNumbers(objeto), info);
    }
  );

  GetAllPlansByNumberPosition = createAsyncThunk<AyudaPlanificacion[], CambiarPosicionDTO>(
    `PlanProdSpp/GetAllPlansByNumberPosition`,
    async (objeto, info) => {
      return await errorNotification(() => this.service.GetAllPlansByNumberPosition(objeto), info);
    }
  );

  ChangePlanInProducing = createAsyncThunk<IPlanProdSpp, any>(
    `PlanProdSpp/ChangePlanInProducing`,
    async (entidad, info) => {
      return await errorNotification(() => this.service.ChangePlanInProducing(entidad), info);
    }
  );

  CancelPlanInProducing = createAsyncThunk<IPlanProdSpp, IPlanProdSpp>(
    `PlanProdSpp/CancelPlanInProducing`,
    async (planProd, info) => {
      return await errorNotification(() => this.service.CancelPlanInProducing(planProd), info);
    }
  );
}

export const PlanProdSppSliceRequest = new PlanProdSppClassSlice(planProdSppService);

const inititalState: optionAditional<IPlanProdSpp> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null,
  planProdNew: []
};

export const PlanProdSppSlice = createSlice({
  name: "PlanProdSppSlice",
  initialState: inititalState,
  reducers: {
    setPlanProd: (state, action: PayloadAction<IPlanProdSpp>) => {
      state.object = action.payload;
    },
    setNewPlanProd: (state, action: PayloadAction<IPlanProdSpp[]>) => {
      state.planProdNew = action.payload;
    },
    setPlanProdActualizado: (state, action: PayloadAction<IPlanProdSpp[]>) => {
      state.dataAll = action.payload;
    }
  },
  extraReducers: (builder) => {
    PlanProdSppSliceRequest.builderAll(builder),
      builder.addCase(PlanProdSppSliceRequest.GetAllPlanByLineProduccionId.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.dataAll = action.payload;
      }),
      builder.addCase(PlanProdSppSliceRequest.GetAllPlanByLineProduccionId.rejected, (state, action) => {
        state.loading = "rejected";
      }),
      builder.addCase(PlanProdSppSliceRequest.GetAllPlanByMonthAndLineProduccionId.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.dataAll = action.payload;
      }),
      builder.addCase(PlanProdSppSliceRequest.GetAllPlanByMonthAndLineProduccionId.rejected, (state, action) => {
        state.loading = "rejected";
      });
  }
});
