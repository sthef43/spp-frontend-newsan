import { IIniState } from "app/models/IIniState";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IOQCModelo } from "app/models/IOQModelo";
import { OQCModeloService } from "app/features/oqcGeneral/services/oqcModelo.service";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
const oqcModeloService = new OQCModeloService();
class oqcModeloClassSlice extends GenericSlice<IOQCModelo> {
  constructor(private service: OQCModeloService) {
    super("OQCModelo", service);
  }
  //nuevos asyncthunks aqui
  getAllByLineaIdRequest = createAsyncThunk<IOQCModelo[], number>(
    `OQCHallazgo/GetAllByLineaId`,
    async (lineaId, info) => {
      return await errorNotification(() => this.service.GetAllByLineaId(lineaId), info);
    }
  );
  GetModeloByEanCodeRequest = createAsyncThunk<IOQCModelo[], string>(
    `OQCHallazgo/GetModeloByEanCode`,
    async (eanCode, info) => {
      return await errorNotification(() => this.service.GetModeloByEanCode(eanCode), info);
    }
  );
  GetAllModelsActivate = createAsyncThunk<IOQCModelo[], number>(
    `OQCHallazgo/GetAllModelsActivate`,
    async (eanCode, info) => {
      return await errorNotification(() => this.service.GetAllModelsActivate(eanCode), info);
    }
  );
}
export const OQCModeloSliceRequests = new oqcModeloClassSlice(oqcModeloService);

const initialState: IIniState<IOQCModelo> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcModeloSlice = createSlice({
  name: "OQCModelo",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IOQCModelo>) => {
      state.object = actions.payload;
    },
    finModelo: (state, action: PayloadAction<number>) => {
      state.object = state.dataAll.find((e) => e.id == action.payload);
    }
  },
  extraReducers: (builder) => {
    OQCModeloSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(OQCModeloSliceRequests.getAllByLineaIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCModeloSliceRequests.getAllByLineaIdRequest.rejected, (state) => {
      state.loading = "rejected";
    });
    builder.addCase(OQCModeloSliceRequests.GetModeloByEanCodeRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCModeloSliceRequests.GetModeloByEanCodeRequest.rejected, (state) => {
      state.loading = "rejected";
    });
    builder.addCase(OQCModeloSliceRequests.GetAllModelsActivate.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCModeloSliceRequests.GetAllModelsActivate.rejected, (state) => {
      state.loading = "rejected";
    });
  }
});
