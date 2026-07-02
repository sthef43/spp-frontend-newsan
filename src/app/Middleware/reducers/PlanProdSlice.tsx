import { IPlanProd } from "app/models/IPlanProd";

import { IIniState } from "app/models/IIniState";
import { OPsDetalles, PlanProdService } from "app/services/planProd.service";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { IModelos } from "app/models";
import { ReporteProduccionExcelDTO } from "app/models/DTO/ReporteProduccionExcelDTO";
//<IAuth, IAuthUser>
const planProdService = new PlanProdService();

interface propsReporte {
  planProd: IPlanProd[];
  fechaDesde: string;
  fechaHasta: string;
}

class PlanProdClassSlice {
  constructor(private service: PlanProdService) {}
  //Nuevos endpoints que no heredan de generic
  getByIdRequest = createAsyncThunk<IPlanProd, number>(`PlanProd/GetById`, async (modelo, info) => {
    return await errorNotification(() => this.service.getByIdRequest(modelo), info);
  });
  getPlanprodByNumeroOpRequest = createAsyncThunk<IPlanProd, string>(
    `PlanProd/GetPlanprodByNumeroOp`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getPlanprodByNumeroOpRequest(modelo), info);
    }
  );

  getListByTipoUnidad = createAsyncThunk<IPlanProd[], string>(`PlanProd/GetListByTipoUnidad`, async (modelo, info) => {
    return await errorNotification(() => this.service.getListByTipoUnidad(modelo), info);
  });

  getModelosByIdLinea = createAsyncThunk<IModelos[], number>(`PlanProd/GetModelosByIdLinea`, async (modelo, info) => {
    return await errorNotification(() => this.service.getModelosByIdLinea(modelo), info);
  });

  getPlanByLineaModeloUnidad = createAsyncThunk<IPlanProd[], { idLinea; modelo; tipoUnidad }>(
    `PlanProd/GetPlanByLineaModeloUnidad`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getPlanByLineaModeloUnidad(modelo), info);
    }
  );
  getPlanByLineaModelo = createAsyncThunk<IPlanProd[], { idLinea; modelo }>(
    `PlanProd/GetPlanByLineaModelo`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getPlanByLineaModelo(modelo), info);
    }
  );
  getSemielaboradoValidacion = createAsyncThunk<IPlanProd[], { tipoSemi; lineaId }>(
    `PlanProd/getSemielaboradoValidacion`,
    async ({ tipoSemi, lineaId }, info) => {
      return await errorNotification(() => this.service.getSemielaboradoValidacion(tipoSemi, lineaId), info);
    }
  );
  getPlanByIdLineaIdModelo = createAsyncThunk<IPlanProd[], { idLinea; idModelo }>(
    `PlanProd/GetPlanByIdLineaIdModelo`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getPlanByIdLineaIdModelo(modelo), info);
    }
  );
  getListByLineaAndModeloAndTipoSemielaborado = createAsyncThunk<IPlanProd[], { idLinea; idModelo; tipoSemielaborado }>(
    `PlanProd/getListByLineaAndModeloAndSemielaborado`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getListByLineaAndModeloAndSemielaborado(modelo), info);
    }
  );
  GetPlanProdByIdLinea = createAsyncThunk<IPlanProd[], number>(
    `PlanProd/GetPlanProdByIdLinea`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetPlanProdByIdLinea(modelo), info);
    }
  );

  getAllByLoteCerradoRequest = createAsyncThunk<IPlanProd[], boolean>(`PlanProd/GetAll`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllByLoteCerradoRequest(modelo), info);
  });

  getAllByLineaIdSinFiltroRequest = createAsyncThunk<IPlanProd[], number>(
    `PlanProd/getAllByLineaIdSinFiltroRequest`,
    async (lineaId, info) => {
      return await errorNotification(() => this.service.getAllByLineaIdSinFiltroRequest(lineaId), info);
    }
  );

  getAllByFechaRequest = createAsyncThunk<IPlanProd[], { fechaDesde; fechaHasta; orgCode }>(
    `PlanProd/GetAllByFecha`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getAllByFechaRequest(modelo), info);
    }
  );
  getAllByFechaAndPlantIdRequest = createAsyncThunk<IPlanProd[], { fechaDesde; fechaHasta; plantId }>(
    `PlanProd/GetAllByFechaAndPlantId`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getAllByFechaAndPlantIdRequest(modelo), info);
    }
  );

  getAllByLineaFechaRequest = createAsyncThunk<IPlanProd[], { idLinea; fechaDesde; fechaHasta }>(
    `PlanProd/GetAllByFechaIdLinea`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getAllByLineaFechaRequest(modelo), info);
    }
  );
  getAllByLineaModeloRequest = createAsyncThunk<IPlanProd[], { idLinea; codigoModelo }>(
    `PlanProd/GetAllByLineaModelo`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getAllByLineaModeloRequest(modelo), info);
    }
  );
  getReporteRequest = createAsyncThunk<IPlanProd[], propsReporte>(`PlanProd/GetReporte`, async (modelo, info) => {
    return await errorNotification(() => this.service.getReporteRequest(modelo), info);
  });
  getReportePorLineaRequest = createAsyncThunk<IPlanProd[], propsReporte>(
    `PlanProd/GetReportePorLinea`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getReportePorLineaRequest(modelo), info);
    }
  );
  getReportePorModeloRequest = createAsyncThunk<IPlanProd[], IPlanProd[]>(
    `PlanProd/GetReportePorModelo`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getReportePorModeloRequest(modelo), info);
    }
  );
  putRequest = createAsyncThunk<boolean, IPlanProd>(
    `PlanProd/PutRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.putRequest(modelo), info);
    }
  );
  postRequest = createAsyncThunk<IPlanProd, IPlanProd>(
    `PlanProd/PostRequest`,

    async (modelo, info) => {
      return await errorNotification(() => this.service.postRequest(modelo), info);
    }
  );
  deleteRequest = createAsyncThunk<boolean, number>(
    `PlanProd/DeleteRequest`,

    async (number, info) => {
      return await errorNotification(() => this.service.DeleteRequest(number), info);
    }
  );
  getAllByLoteCerradoNull = createAsyncThunk<IPlanProd[]>(`PlanProd/getAllByLoteCerradoNull`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllByLoteCerradoNull(), info);
  });
  getAllModelosRequest = createAsyncThunk<IModelos[]>(`PlanProd/GetAllModelos`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllModelos(), info);
  });
  getAllModelosByLineaIdRequest = createAsyncThunk<IModelos[], number>(
    `PlanProd/GetAllModelosByLineaId`,
    async (lineaId, info) => {
      return await errorNotification(() => this.service.getAllModelosByLineaId(lineaId), info);
    }
  );
  getAllModelosHistoricoByLineaIdRequest = createAsyncThunk<IModelos[], number>(
    `PlanProd/GetAllModelosHistoricoByLineaId`,
    async (lineaId, info) => {
      return await errorNotification(() => this.service.getAllModelosHistoricoByLineaId(lineaId), info);
    }
  );
  getListByLineaIdRequest = createAsyncThunk<IPlanProd[], number>(
    `PlanProd/getListByLineaIdRequest`,
    async (lineaId, info) => {
      return await errorNotification(() => this.service.getListByLineaIdRequest(lineaId), info);
    }
  );
  getListByGroupByModelosRequest = createAsyncThunk<IPlanProd[]>(
    `PlanProd/getListByGroupByModelosRequest`,
    async (lineaId, info) => {
      return await errorNotification(() => this.service.getListByGroupByModelosRequest(), info);
    }
  );
  GetOpsByModelo = createAsyncThunk<IPlanProd, { modelo; semielaborado }>(
    `PlanProd/GetOpsByModelo`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetOpsByModelo(modelo.modelo, modelo.semielaborado), info);
    }
  );
  GetOpsSemiElaborado = createAsyncThunk<IPlanProd[], { modelo; semielaboradoId }>(
    `PlanProd/GetOpsSemilaborados`,
    async (modelo, info) => {
      return await errorNotification(
        () => this.service.GetOpsSemiElaborado(modelo.modelo, modelo.semielaboradoId),
        info
      );
    }
  );
  GetAllLotesByModelo = createAsyncThunk<IPlanProd[], string>(`PlanProd/GetAllLotesByModelo`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetAllLotesByModelo(modelo), info);
  });
  GetListByLineaAndTipoPlaca = createAsyncThunk<IPlanProd[], { idLinea; tipoPlaca }>(
    `PlanProd/GetListByLineaAndTipoPlaca`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByLineaAndTipoPlaca(modelo), info);
    }
  );

  GetOPsDelDia = createAsyncThunk<OPsDetalles[], number>(`PlanProd/GetOPSdelDia`, async (identificadorLinea, info) => {
    return await errorNotification(() => this.service.GetOPsDelDia(identificadorLinea), info);
  });

  getAllByLineaIdRequest = createAsyncThunk<IPlanProd[], number>(
    `PlanProd/getAllByLineaIdRequest`,
    async (lineaId, info) => {
      return await errorNotification(() => this.service.getAllByLineaIdRequest(lineaId), info);
    }
  );
  getUtimasByLineaRequest = createAsyncThunk<IPlanProd[], { lineaId; codigoNewsan2 }>(
    `PlanProd/getUtimasByLineaRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getUtimasByLinea(modelo), info);
    }
  );
  getUtimasByTipoSemiRequest = createAsyncThunk<IPlanProd[], string>(
    `PlanProd/getUtimasByTipoSemiRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getUtimasByTipoSemi(modelo), info);
    }
  );
  getListModelsByIdentifyLine = createAsyncThunk<IPlanProd[], { identificador; lineaId }>(
    `PlanProd/getListModelsByIdentifyLine`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getListModelsByIdentifyLine(modelo), info);
    }
  );
  GetLastPlanProdByModeloWithRemanent = createAsyncThunk<IPlanProd, { modelo; nombreLinea }>(
    `PlanProd/GetLastPlanProdByModeloWithRemanent`,
    async ({ modelo, nombreLinea }, info) => {
      return await errorNotification(() => this.service.GetLastPlanProdByModeloWithRemanent(modelo, nombreLinea), info);
    }
  );
  GetAllReportByRangeDateRequest = createAsyncThunk<ReporteProduccionExcelDTO[], { fecha: string; plantId: number }>(
    `PlanProd/GetAllReportByRangeDateRequest`,
    async ({ fecha, plantId }, info) => {
      return await errorNotification(() => this.service.GetAllReportByRangeDateRequest(fecha, plantId), info);
    }
  );
}
export const PlanProdSliceRequests = new PlanProdClassSlice(planProdService);

const initialState: IIniState<IPlanProd | OPsDetalles> = {
  loading: null,
  dataAll: [],
  data: null
};

export const PlanProdSlice = createSlice({
  name: "PlanProd",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IPlanProd>) => {
      state.object = actions.payload;
    }
  },
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(PlanProdSliceRequests.getByIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.getByIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(PlanProdSliceRequests.getPlanprodByNumeroOpRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.getPlanprodByNumeroOpRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(PlanProdSliceRequests.getModelosByIdLinea.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.getModelosByIdLinea.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PlanProdSliceRequests.getSemielaboradoValidacion.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.getSemielaboradoValidacion.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(PlanProdSliceRequests.GetPlanProdByIdLinea.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.GetPlanProdByIdLinea.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(PlanProdSliceRequests.getAllByLineaIdSinFiltroRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.getAllByLineaIdSinFiltroRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(PlanProdSliceRequests.getPlanByLineaModeloUnidad.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.getPlanByLineaModeloUnidad.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PlanProdSliceRequests.getPlanByLineaModelo.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.getPlanByLineaModelo.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PlanProdSliceRequests.getPlanByIdLineaIdModelo.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.getPlanByIdLineaIdModelo.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(PlanProdSliceRequests.getAllByLoteCerradoRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.getAllByLoteCerradoRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PlanProdSliceRequests.getReporteRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.getReporteRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PlanProdSliceRequests.getReportePorLineaRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.getReportePorLineaRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PlanProdSliceRequests.getReportePorModeloRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.getReportePorModeloRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PlanProdSliceRequests.getAllByFechaRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.getAllByFechaRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PlanProdSliceRequests.getAllByLineaFechaRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.getAllByLineaFechaRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PlanProdSliceRequests.getAllByLineaModeloRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.getAllByLineaModeloRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PlanProdSliceRequests.putRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.putRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PlanProdSliceRequests.deleteRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.deleteRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PlanProdSliceRequests.getListByLineaIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.getListByLineaIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PlanProdSliceRequests.getAllModelosByLineaIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.getListModelsByIdentifyLine.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PlanProdSliceRequests.getListModelsByIdentifyLine.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.getAllModelosByLineaIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(PlanProdSliceRequests.GetOpsByModelo.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.object = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.GetOpsByModelo.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(PlanProdSliceRequests.GetOpsSemiElaborado.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.GetOpsSemiElaborado.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(PlanProdSliceRequests.GetAllLotesByModelo.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.GetAllLotesByModelo.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(PlanProdSliceRequests.GetOPsDelDia.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(PlanProdSliceRequests.GetOPsDelDia.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
