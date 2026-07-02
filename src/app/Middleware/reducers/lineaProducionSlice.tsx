import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { ILineaProduccion } from "app/models/ILineaProduccion";
import { LineaProduccionService } from "app/services/lineaProduccion.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const lineaProduccionService = new LineaProduccionService();
class lineaProduccionClassSlice extends GenericSlice<ILineaProduccion> {
  constructor(private service: LineaProduccionService) {
    super("LineaProduccion", service);
  }
  getLineaByPlantIdRequest = createAsyncThunk<ILineaProduccion[], number>(
    `LineaProduccion/GetLineaByPlantId`,
    async (id, info) => {
      return await errorNotification(() => this.service.getLineaByPlantIdRequest(id), info);
    }
  );
  getLineaByPlantaIdAndProductoId = createAsyncThunk<ILineaProduccion[], { plantaId; productoId }>(
    `LineaProduccion/GetLineaByPlantIdAndProductId`,
    async (linea, info) => {
      return await errorNotification(() => this.service.getLineaByPlantaIdAndProductoId(linea), info);
    }
  );
  GetOnlyLinesMountingByProductIdAndPlantId = createAsyncThunk<ILineaProduccion[], { plantaId; productoId }>(
    `LineaProduccion/GetOnlyLinesMountingByProductIdAndPlantId`,
    async (linea, info) => {
      return await errorNotification(() => this.service.GetOnlyLinesMountingByProductIdAndPlantId(linea), info);
    }
  );
  getAllByProductId = createAsyncThunk<ILineaProduccion[], number>(
    `LineaProduccion/GetAllByProductId`,
    async (productId, info) => {
      return await errorNotification(() => this.service.getAllByProductId(productId), info);
    }
  );
  getByIdentificadorLinea = createAsyncThunk<ILineaProduccion, any>(
    `LineaProduccion/GetByIdentificadorLinea`,
    async (identificadorLinea, info) => {
      return await errorNotification(() => this.service.GetByIdentificadorLinea(identificadorLinea), info);
    }
  );
  getByPlantId = createAsyncThunk<ILineaProduccion[], number>(
    `LineaProduccion/GetByPlantId`,
    async (plantId, info) => {
      return await errorNotification(() => this.service.getByPlantIdRequest(plantId), info);
    }
  );
  getAllLinesWithOnlyAirByPlantaId = createAsyncThunk<ILineaProduccion[], number>(
    `LineaProduccion/getAllLinesWithOnlyAirByPlantaId`,
    async (plantId, info) => {
      return await errorNotification(() => this.service.getAllLinesWithOnlyAirByPlantaId(plantId), info);
    }
  );
}
export const LineaProduccionSliceRequests = new lineaProduccionClassSlice(lineaProduccionService);

const initialState: IIniState<ILineaProduccion> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const lineaProduccionSlice = createSlice({
  name: "LineaProduccion",
  initialState: initialState,
  reducers: {
    setSelectLinea: (state, payload: PayloadAction<number>) => {
      state.object = state.dataAll.find((linea) => linea.id == payload.payload);
    }
  },
  extraReducers: (builder) => {
    LineaProduccionSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(LineaProduccionSliceRequests.getAllByProductId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(LineaProduccionSliceRequests.getAllByProductId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(LineaProduccionSliceRequests.getLineaByPlantIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(LineaProduccionSliceRequests.getLineaByPlantIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(LineaProduccionSliceRequests.getLineaByPlantaIdAndProductoId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(LineaProduccionSliceRequests.getLineaByPlantaIdAndProductoId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(LineaProduccionSliceRequests.GetOnlyLinesMountingByProductIdAndPlantId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(LineaProduccionSliceRequests.GetOnlyLinesMountingByProductIdAndPlantId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(LineaProduccionSliceRequests.getByIdentificadorLinea.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(LineaProduccionSliceRequests.getByIdentificadorLinea.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
