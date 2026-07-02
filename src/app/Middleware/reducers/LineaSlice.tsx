import { ILinea } from "app/models/ILinea";
import { IIniState } from "app/models/IIniState";
import { LineaService } from "app/services/linea.service";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
//<IAuth, IAuthUser>
const lineaService = new LineaService();

class LineaClassSlice {
  constructor(private service: LineaService) {}
  //Nuevos endpoints que no heredan de generic
  getByIdRequest = createAsyncThunk<ILinea, number>(`Linea/GetById`, async (modelo, info) => {
    return await errorNotification(() => this.service.getByIdRequest(modelo), info);
  });
  getAllRequest = createAsyncThunk<ILinea[]>(`Linea/GetAllActivas`, async (info, thunk) => {
    return await errorNotification(() => this.service.getAllRequest(), thunk);
  });
  getAllSinFiltroRequest = createAsyncThunk<ILinea[]>(`Linea/GetAll`, async (info, thunk) => {
    return await errorNotification(() => this.service.getAllSinFiltroRequest(), thunk);
  });
  multiPutRequest = createAsyncThunk<ILinea[], ILinea[]>(`Linea/MultiPut`, async (modelos, info) => {
    return await errorNotification(() => this.service.multiPutRequest(modelos), info);
  });
  cambiarEBSRequest = createAsyncThunk<boolean, string>(`Linea/CambiarEBS`, async (condicion, info) => {
    return await errorNotification(() => this.service.cambiarEBSRequest(condicion), info);
  });
  postRequest = createAsyncThunk<boolean, ILinea>(`Linea/Add`, async (entity, info) => {
    return await errorNotification(() => this.service.postRequest(entity), info);
  });
  putRequest = createAsyncThunk<boolean, ILinea>(`Linea/Update`, async (entity, info) => {
    return await errorNotification(() => this.service.putRequest(entity), info);
  });
  GetByCodigoInicio = createAsyncThunk<ILinea, string>(`Linea/GetByCodigoInicio`, async (codigoInicio, info) => {
    return await errorNotification(() => this.service.getByCodigoInicio(codigoInicio), info);
  });
  GetListByTipoProduccion = createAsyncThunk<ILinea[], string>(
    `Linea/GetListByTipoProduccion`,
    async (tipoProduccion, info) => {
      return await errorNotification(() => this.service.getListByTipoProduccion(tipoProduccion), info);
    }
  );
  GetListByPlantId = createAsyncThunk<ILinea[], number>(`Linea/GetListByPlantId`, async (plantaId, info) => {
    return await errorNotification(() => this.service.getListByPlantId(plantaId), info);
  });
  GetLineasByTypeProducctionAndActive = createAsyncThunk<ILinea[], number>(
    `Linea/GetLineasByTypeProducctionAndActive`,
    async (plantaId, info) => {
      return await errorNotification(() => this.service.GetLineasByTypeProducctionAndActive(plantaId), info);
    }
  );
}
export const LineaSliceRequests = new LineaClassSlice(lineaService);

const initialState: IIniState<ILinea> = {
  loading: null,
  dataAll: [],
  data: null,
  object: null
};

export const LineaSlice = createSlice({
  name: "Linea",
  initialState: initialState,
  reducers: {
    setSelectLinea: (state, payload: PayloadAction<number>) => {
      state.object = state.dataAll.find((linea) => linea.idLinea == payload.payload);
    },
    setStateObject: (state, action: PayloadAction<ILinea>) => {
      state.object = action.payload;
    }
  },
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(LineaSliceRequests.getByIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(LineaSliceRequests.getByIdRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(LineaSliceRequests.GetListByPlantId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(LineaSliceRequests.GetListByPlantId.rejected, (state, action) => {
      state.loading = "rejected";
    });

    builder.addCase(LineaSliceRequests.getAllRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(LineaSliceRequests.getAllRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(LineaSliceRequests.getAllSinFiltroRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(LineaSliceRequests.getAllSinFiltroRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(LineaSliceRequests.multiPutRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(LineaSliceRequests.multiPutRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(LineaSliceRequests.GetByCodigoInicio.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.object = action.payload;
    });
    builder.addCase(LineaSliceRequests.GetByCodigoInicio.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(LineaSliceRequests.GetLineasByTypeProducctionAndActive.fulfilled, (state, action) => {
      state.loading = "fullfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(LineaSliceRequests.GetLineasByTypeProducctionAndActive.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
