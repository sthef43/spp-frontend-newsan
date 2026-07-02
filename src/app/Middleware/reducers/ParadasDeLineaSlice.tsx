import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { IParadasDeLinea } from "app/models/IParadasDeLinea";
import { ParadasDeLineaService } from "app/services/paradasDeLinea.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { ParadasPorSectorDTO } from "app/models/DTO/ParadasPorSectorDTO";

const paradasDeLineaService = new ParadasDeLineaService();
class paradasDeLineaClassSlice extends GenericSlice<IParadasDeLinea> {
  constructor(private service: ParadasDeLineaService) {
    super("ParadasDeLinea", service);
  }
  //nuevos asyncthunks aqui
  GetByFilters = createAsyncThunk<IParadasDeLinea[], { fechaInicio; fechaFin; lineaId; turnoId }>(
    `ParadasDeLinea/GetByFilters`,
    async (filters, info) => {
      return await errorNotification(() => this.service.GetByFilters(filters), info);
    }
  );
  GetAllByPlantId = createAsyncThunk<IParadasDeLinea[], { fechaInicio; fechaFin; plantId; turnoId }>(
    `ParadasDeLinea/GetAllByPlantId`,
    async (filters, info) => {
      return await errorNotification(() => this.service.GetAllByPlantId(filters), info);
    }
  );
  GetParadaByNombreLinea = createAsyncThunk<IParadasDeLinea[], { fechaInicio; fechaFin; nombreL }>(
    `ParadasDeLinea/GetParadaByNP`,
    async (filters, info) => {
      return await errorNotification(() => this.service.GetParadaByNP(filters), info);
    }
  );
  GetParadaByNombreLineayTurno = createAsyncThunk<IParadasDeLinea[], { fechaInicio; fechaFin; nombreL; turno }>(
  `ParadasDeLinea/GetParadaByNPyT`,
  async (filters, info) => {
    return await errorNotification(() => this.service.GetParadaByNPyT(filters), info);

  }
);
  
  GetByFiltersAndDiscontinuo = createAsyncThunk<IParadasDeLinea[], { fecha; lineaId; turnoId; discontinuo }>(
    `ParadasDeLinea/GetByFiltersAndDiscontinuo`,
    async (filters, info) => {
      return await errorNotification(() => this.service.GetByFiltersAndDiscontinuo(filters), info);

    }
  );

GetTotalParadasDeLineaByDate = createAsyncThunk<ParadasPorSectorDTO[], { 
  fechaInicio: string; 
    fechaFin: string; 
    plantaId: number | null; 
    productoId: number | null;
}>(
  `ParadasDeLinea/GetTotalParadasDeLineaByDate`,
  async (filters, info) => {
    return await errorNotification(() => this.service.GetTotalParadasDeLineaByDate(filters), info);
  }
)
}

export const ParadasDeLineaSliceRequests = new paradasDeLineaClassSlice(paradasDeLineaService);
interface IParadasDeLineaState extends IIniState<IParadasDeLinea> {
  dataAgrupada?: ParadasPorSectorDTO[] | null; 
}

const initialState: IParadasDeLineaState = {
  loading: null,
  data: null,
  dataAgrupada: null
};

export const paradasDeLineaSlice = createSlice({
  name: "ParadasDeLinea",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ParadasDeLineaSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(ParadasDeLineaSliceRequests.GetByFilters.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ParadasDeLineaSliceRequests.GetByFilters.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ParadasDeLineaSliceRequests.GetAllByPlantId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ParadasDeLineaSliceRequests.GetAllByPlantId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ParadasDeLineaSliceRequests.GetParadaByNombreLinea.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(ParadasDeLineaSliceRequests.GetParadaByNombreLinea.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ParadasDeLineaSliceRequests.GetTotalParadasDeLineaByDate.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAgrupada = action.payload;
    });
    builder.addCase(ParadasDeLineaSliceRequests.GetTotalParadasDeLineaByDate.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
