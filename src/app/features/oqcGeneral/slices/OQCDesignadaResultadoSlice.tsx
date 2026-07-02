import { IIniState } from "app/models/IIniState";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { IOQCDesignadaResultado } from "app/models/IOQCDesignadaResultado";
import { OQCDesignadaResultadoService } from "app/features/oqcGeneral/services/oqcDesignadaResultado.service";
import { ReporteOQC } from "app/models/Stored Procdure/ReporteOQC";
import { NumerosNewsanDTO } from "app/models/DTO/NumerosNewsanDTO";
import { IDatesMotorola } from "app/models/sfcsplus/IDatesMotorola";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";

const oqcDesignadaResultadoService = new OQCDesignadaResultadoService();

class oqcDesignadaResultadoClassSlice extends GenericSlice<IOQCDesignadaResultado> {
  constructor(private service: OQCDesignadaResultadoService) {
    super("OQCDesignadaResultado", service);
  }
  //nuevos asyncthunks aqui
  getAllByDateAndLineaAndTurnoRequest = createAsyncThunk<
    IOQCDesignadaResultado[],
    { fechaDesde; fechaHasta; lineaId; turnoAbre }
  >(`OQCBloque/GetAllByDateAndLineaId`, async (model, info) => {
    return await errorNotification(() => this.service.getAllByDateAndLineaAndTurno(model), info);
  });
  getAllRegistersByDateAndLineaId = createAsyncThunk<IOQCDesignadaResultado[], { fechaDesde; fechaHasta; lineaId }>(
    `OQCBloque/GetAllRegistersByDateAndLineaId`,
    async (model, info) => {
      return await errorNotification(() => this.service.getAllRegistersByDateAndLineaId(model), info);
    }
  );
  getAllRegistersByDateAndLineaIdWithLengthFind = createAsyncThunk<
    IOQCDesignadaResultado[],
    { fechaDesde; fechaHasta; lineaId; turnoAbreviatura }
  >(`OQCBloque/getAllRegistersByDateAndLineaIdWithLengthFind`, async (model, info) => {
    return await errorNotification(() => this.service.getAllRegistersByDateAndLineaIdWithLengthFind(model), info);
  });
  getReportOQCByDatesAndLine = createAsyncThunk<
    IOQCDesignadaResultado[],
    { fechaDesde; fechaHasta; lineaId; turnoAbreviatura; opcionHallazgo }
  >(`OQCBloque/getReportOQCByDatesAndLine`, async (model, info) => {
    return await errorNotification(() => this.service.getReportOQCByDatesAndLine(model), info);
  });
  getSGIReportRequest = createAsyncThunk<IOQCDesignadaResultado[], { year; lineaId }>(
    `OQCBloque/getSGIReportRequest`,
    async (model, info) => {
      return await errorNotification(() => this.service.getSGIReportRequest(model), info);
    }
  );
  getSGIReportByProductoRequest = createAsyncThunk<IOQCDesignadaResultado[], { year; productId }>(
    `OQCBloque/getSGIReportByProductIdRequest`,
    async (model, info) => {
      return await errorNotification(() => this.service.getSGIReportByProductoRequest(model), info);
    }
  );
  getSGIReportByModeloRequest = createAsyncThunk<IOQCDesignadaResultado[], { year; modelo }>(
    `OQCBloque/getSGIReportByModeloRequest`,
    async (model, info) => {
      return await errorNotification(() => this.service.getSGIReportByModeloRequest(model), info);
    }
  );
  getModelosByLinea = createAsyncThunk<string[], number>(`OQCBloque/getModelosByLinea`, async (lineaId, info) => {
    return await errorNotification(() => this.service.getModelosByLinea(lineaId), info);
  });
  getAllRegisterByLPN = createAsyncThunk<IOQCDesignadaResultado[], string>(
    `OQCBloque/getAllRegisterByLPN`,
    async (lpn, info) => {
      return await errorNotification(() => this.service.getAllRegisterByLPN(lpn), info);
    }
  );
  getAllRegistersByPalletId = createAsyncThunk<IOQCDesignadaResultado[], number>(
    "OQCBloque/getAllRegisterByPalletId",
    async (palletId, info) => {
      return await errorNotification(() => this.service.getAllRegistersByPalletId(palletId), info);
    }
  );
  getBySerieNumber = createAsyncThunk<IOQCDesignadaResultado, string>(
    "OQCBloque/getBySerieNumber",
    async (NumeroSerie, info) => {
      return await errorNotification(() => this.service.getBySerieNumber(NumeroSerie), info);
    }
  );
  getNewsanFromAndUntil = createAsyncThunk<NumerosNewsanDTO, number>(
    "OQCBloque/getNewsanFromAndUntil",
    async (palletId, info) => {
      return await errorNotification(() => this.service.getNewsanFromAndUntil(palletId), info);
    }
  );
  getLastReportByPalletId = createAsyncThunk<IOQCDesignadaResultado, number>(
    "OQCBloque/getLastReportByPalletId",
    async (palletId, info) => {
      return await errorNotification(() => this.service.getLastReportByPalletId(palletId), info);
    }
  );
  getReportForPlant = createAsyncThunk<ReporteOQC[], { fechaDesde; fechaHasta; plantaId }>(
    "OQCBloque/getReportForPlant",
    async (palletId, info) => {
      return await errorNotification(() => this.service.getReportForPlant(palletId), info);
    }
  );
  getReportOQCByDatesAndPlant = createAsyncThunk<IOQCDesignadaResultado[], { fechaDesde; fechaHasta; plantaId }>(
    "OQCBloque/getReportOQCByDatesAndPlant",
    async (palletId, info) => {
      return await errorNotification(() => this.service.getReportOQCByDatesAndPlant(palletId), info);
    }
  );
  GetAlldatesByOQCId = createAsyncThunk<IOQCDesignadaResultado, number>(
    `OQCBloque/GetAlldatesByOQCId`,
    async (oqcId, info) => {
      return await errorNotification(() => this.service.GetAlldatesByOQCId(oqcId), info);
    }
  );
  GetAllDatesMotorola = createAsyncThunk<IDatesMotorola[], string>(
    `OQCBloque/GetAllDatesMotorola`,
    async (trackId, info) => {
      return await errorNotification(() => this.service.GetAllDatesMotorola(trackId), info);
    }
  );
}
export const OQCDesignadaResultadoSliceRequests = new oqcDesignadaResultadoClassSlice(oqcDesignadaResultadoService);

const initialState: IIniState<IOQCDesignadaResultado> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcDesignadaResultadoSlice = createSlice({
  name: "OQCDesignadaResultado",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IOQCDesignadaResultado>) => {
      state.object = actions.payload;
    },
    setClear: (state) => {
      state.dataAll = [];
      state.object = null;
    }
  },
  extraReducers: (builder) => {
    OQCDesignadaResultadoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(
      OQCDesignadaResultadoSliceRequests.getAllByDateAndLineaAndTurnoRequest.fulfilled,
      (state, action) => {
        state.loading = "fulfilled";
        state.dataAll = action.payload;
      }
    );
    builder.addCase(OQCDesignadaResultadoSliceRequests.getAllByDateAndLineaAndTurnoRequest.rejected, (state, _) => {
      state.loading = "rejected";
    });
    builder.addCase(OQCDesignadaResultadoSliceRequests.getSGIReportRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCDesignadaResultadoSliceRequests.getSGIReportRequest.rejected, (state, _) => {
      state.loading = "rejected";
    });
    builder.addCase(OQCDesignadaResultadoSliceRequests.getSGIReportByProductoRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCDesignadaResultadoSliceRequests.getSGIReportByProductoRequest.rejected, (state, _) => {
      state.loading = "rejected";
    });
    builder.addCase(OQCDesignadaResultadoSliceRequests.getSGIReportByModeloRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCDesignadaResultadoSliceRequests.getSGIReportByModeloRequest.rejected, (state, _) => {
      state.loading = "rejected";
    });
    builder.addCase(OQCDesignadaResultadoSliceRequests.getAllRegistersByPalletId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCDesignadaResultadoSliceRequests.getAllRegistersByPalletId.rejected, (state, _) => {
      state.loading = "rejected";
    });
    builder.addCase(OQCDesignadaResultadoSliceRequests.getAllRegisterByLPN.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCDesignadaResultadoSliceRequests.getAllRegisterByLPN.rejected, (state, _) => {
      state.loading = "rejected";
    });
    builder.addCase(OQCDesignadaResultadoSliceRequests.getAllRegistersByDateAndLineaId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCDesignadaResultadoSliceRequests.getAllRegistersByDateAndLineaId.rejected, (state, _) => {
      state.loading = "rejected";
    });
    builder.addCase(
      OQCDesignadaResultadoSliceRequests.getAllRegistersByDateAndLineaIdWithLengthFind.fulfilled,
      (state, action) => {
        state.loading = "fulfilled";
        state.dataAll = action.payload;
      }
    );
    builder.addCase(
      OQCDesignadaResultadoSliceRequests.getAllRegistersByDateAndLineaIdWithLengthFind.rejected,
      (state, _) => {
        state.loading = "rejected";
      }
    );
    builder.addCase(OQCDesignadaResultadoSliceRequests.getReportOQCByDatesAndLine.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCDesignadaResultadoSliceRequests.getReportOQCByDatesAndLine.rejected, (state, _) => {
      state.loading = "rejected";
    });
  }
});
