import { ILineaPuesto } from "app/models/ILineaPuesto";
import { LineaPuestoService } from "app/services/lineaPuesto.service";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const lineaPuestoService = new LineaPuestoService();
class lineaPuestoClassSlice extends GenericSlice<ILineaPuesto> {
  constructor(private service: LineaPuestoService) {
    super("LineaPuesto", service);
  }
  getAllWithRelations = createAsyncThunk<ILineaPuesto[], number>(
    "LineaPuesto/GetAllWithRelations",
    async (productId, thunk) => {
      return await errorNotification(() => this.service.getAllWithRelations(productId), thunk);
    }
  );
  getAllByLineaId = createAsyncThunk<ILineaPuesto[], number>("LineaPuesto/GetAllByLineaId", async (lineaId, thunk) => {
    return await errorNotification(() => this.service.getAllByLineaId(lineaId), thunk);
  });
  getAllPuestoRechazoByLineaId = createAsyncThunk<ILineaPuesto[], number>(
    "LineaPuesto/GetAllPuestoRechazoByLineaId",
    async (lineaId, thunk) => {
      return await errorNotification(() => this.service.getAllPuestoRechazoByLineaProduccion(lineaId), thunk);
    }
  );
}
export const LineaPuestoSliceRequest = new lineaPuestoClassSlice(lineaPuestoService);

const initialState: IIniState<ILineaPuesto> = {
  loading: null,
  data: null
};

export const LineaPuestoSlice = createSlice({
  name: "LineaPuesto",
  initialState: initialState,
  reducers: {
    selectLineaPuesto: (state, action: PayloadAction<number>) => {
      state.object = state.dataAll.find((s) => s.id == action.payload);
    },
    setObject: (state, actions: PayloadAction<ILineaPuesto>) => {
      state.object = actions.payload;
    }
  },
  extraReducers: (builder) => {
    LineaPuestoSliceRequest.builderAll(builder);
    builder.addCase(LineaPuestoSliceRequest.getAllWithRelations.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(LineaPuestoSliceRequest.getAllWithRelations.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(LineaPuestoSliceRequest.getAllByLineaId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(LineaPuestoSliceRequest.getAllByLineaId.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(LineaPuestoSliceRequest.getAllPuestoRechazoByLineaId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(LineaPuestoSliceRequest.getAllPuestoRechazoByLineaId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
