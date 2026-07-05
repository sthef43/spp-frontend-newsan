import { IIniState } from "app/models/IIniState";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IOQCPalet } from "app/models/IOQCPalet";
import { OQCPaletService } from "app/features/oqcGeneral/services/oqcPalet.service";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
const oqcPaletService = new OQCPaletService();
class oqcPaletClassSlice extends GenericSlice<IOQCPalet> {
  constructor(private service: OQCPaletService) {
    super("OQCPalet", service);
  }
  //nuevos asyncthunks aqui
  getByOQCandModelo = createAsyncThunk<IOQCPalet, { oqcDesiId; modeloId }>(
    `OQCPalet/GetAllByOQCandModelo`,
    async ({ oqcDesiId, modeloId }, info) => {
      return await errorNotification(() => this.service.GetAllByOQCandModelo(oqcDesiId, modeloId), info);
    }
  );
  getLPNGeneric = createAsyncThunk<string>(`OQCPalet/getLPNGeneric`, async (_, info) => {
    return await errorNotification(() => this.service.GetLPNGeneric(), info);
  });
  getAllByModeloIdRequest = createAsyncThunk<IOQCPalet[], { modeloId; lineaId }>(
    `OQCPalet/GetAllByModeloId`,
    async (modeloId, info) => {
      return await errorNotification(() => this.service.GetAllByModeloId(modeloId), info);
    }
  );
  getByLpn = createAsyncThunk<IOQCPalet, string>(`OQCPalet/GetByLPN`, async (LPN, info) => {
    return await errorNotification(() => this.service.GetByLPN(LPN), info);
  });
  getAllDatesPalletByPlantAndModelId = createAsyncThunk<IOQCPalet[], { plantId; modeloId }>(
    `OQCPalet/GetAllDatesPalletByPlantAndModelId`,
    async ({ plantId, modeloId }, info) => {
      return await errorNotification(() => this.service.GetAllDatesPalletByPlantAndModelId(plantId, modeloId), info);
    }
  );
  getAllPaletsByModel = createAsyncThunk<IOQCPalet[], number>(
    `OQCPalet/GetAllPaletsByModel`,
    async (modeloId, info) => {
      return await errorNotification(() => this.service.GetAllPaletsByModel(modeloId), info);
    }
  );
  getLastPalet = createAsyncThunk<IOQCPalet>("OQCPalet/GetLastPalet", async (palet, info) => {
    return await errorNotification(() => this.service.GetLastPalet(), info);
  });
  searchPaletOpen = createAsyncThunk<IOQCPalet, number>("OQCPalet/searchPaletOpen", async (palet, info) => {
    return await errorNotification(() => this.service.SearchPaletOpen(palet), info);
  });
  getLastTwoPallets = createAsyncThunk<IOQCPalet[], { plantId; modeloId }>(
    `OQCPalet/GetLastTwoPallets`,
    async ({ plantId, modeloId }, info) => {
      return await errorNotification(() => this.service.GetLastTwoPallets(plantId, modeloId), info);
    }
  );
  getPalletWithRechazos = createAsyncThunk<IOQCPalet, number>(`OQCPalet/GetPalletWithRechazos`, async (id, info) => {
    return await errorNotification(() => this.service.GetPalletWithRechazos(id), info);
  });
}
export const OQCPaletSliceRequests = new oqcPaletClassSlice(oqcPaletService);

const initialState: IIniState<IOQCPalet> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcPaletSlice = createSlice({
  name: "OQCPalet",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IOQCPalet>) => {
      state.object = actions.payload;
    },
    setDataAll: (state, actions: PayloadAction<IOQCPalet[]>) => {
      state.dataAll = actions.payload;
    },
    setPaletSelect: (state, payload: PayloadAction<number>) => {
      state.data = state.dataAll.find((linea) => linea.id == payload.payload);
    }
  },
  extraReducers: (builder) => {
    OQCPaletSliceRequests.builderAll(builder);
    builder.addCase(OQCPaletSliceRequests.PutRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
      state.object = action.payload;
    });
    builder.addCase(OQCPaletSliceRequests.PutRequest.rejected, (state) => {
      state.loading = "rejected";
    });
    builder.addCase(OQCPaletSliceRequests.PostRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
      state.object = action.payload;
    });
    builder.addCase(OQCPaletSliceRequests.PostRequest.rejected, (state) => {
      state.loading = "rejected";
    });
    //nuevos manejos de asyncthunk aqui
    builder.addCase(OQCPaletSliceRequests.getByOQCandModelo.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.object = action.payload;
    });
    builder.addCase(OQCPaletSliceRequests.getByOQCandModelo.rejected, (state) => {
      state.loading = "rejected";
    });
    builder.addCase(OQCPaletSliceRequests.getAllByModeloIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCPaletSliceRequests.getAllByModeloIdRequest.rejected, (state) => {
      state.loading = "rejected";
    });
    builder.addCase(OQCPaletSliceRequests.getByLpn.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.object = action.payload;
    });
    builder.addCase(OQCPaletSliceRequests.getByLpn.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(OQCPaletSliceRequests.getAllDatesPalletByPlantAndModelId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCPaletSliceRequests.getAllDatesPalletByPlantAndModelId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(OQCPaletSliceRequests.getAllPaletsByModel.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCPaletSliceRequests.getAllPaletsByModel.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
