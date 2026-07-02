import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { ILineaPuestoTablero } from "app/models/ILineaPuestoTablero";
import { LineaPuestoTableroService } from "app/services/lineaPuestoTablero.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const lineaPuestoTableroService = new LineaPuestoTableroService();
class lineaPuestoTableroClassSlice extends GenericSlice<ILineaPuestoTablero> {
  constructor(private service: LineaPuestoTableroService) {
    super("LineaPuestoTablero", service);
  }
  getByLineaPuestoId = createAsyncThunk<ILineaPuestoTablero, number>(
    "LineaPuestoTablero/getByLineaPuestoId",
    async (id, thunk) => {
      return await errorNotification(() => this.service.getByLineaPuestoId(id), thunk);
    }
  );
}
export const LineaPuestoTableroSliceRequest = new lineaPuestoTableroClassSlice(lineaPuestoTableroService);

const initialState: IIniState<ILineaPuestoTablero> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const LineaPuestoTableroSlice = createSlice({
  name: "LineaPuestoTablero",
  initialState: initialState,
  reducers: {
    selectLineaPuestoTablero: (state, action: PayloadAction<number>) => {
      state.object = state.dataAll.find((s) => s.id == action.payload);
    },
    setObject: (state, actions: PayloadAction<ILineaPuestoTablero>) => {
      state.object = actions.payload;
    },
    setProducido: (state, actions: PayloadAction<number>) => {
      state.object.producido = actions.payload;
    },
    setColor: (state, actions: PayloadAction<string>) => {
      state.object.color = actions.payload;
    }
  },
  extraReducers: (builder) => {
    LineaPuestoTableroSliceRequest.builderAll(builder);
    builder.addCase(LineaPuestoTableroSliceRequest.getByLineaPuestoId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.object = action.payload;
    });
    builder.addCase(LineaPuestoTableroSliceRequest.getByLineaPuestoId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
