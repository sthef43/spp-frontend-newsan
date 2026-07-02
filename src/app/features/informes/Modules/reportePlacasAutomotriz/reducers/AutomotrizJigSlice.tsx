import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { IIniState } from "app/models";
import { IAutomotrizJig } from "../Interfaces/IAutomotrizJig";
import { InformePlacasAutomotrizSP } from "../Interfaces/InformePlacasAutomotrizSP";
import { AutomotrizJigService } from "../services/AutomotrizJig.service";

const automotrizJigService = new AutomotrizJigService();

class automotrizJigClassSlice extends GenericSlice<IAutomotrizJig> {
  constructor(private service: AutomotrizJigService) {
    super("AutomotrizJig", service);
  }

  GetPlatesByLineAndFromAndUntil = createAsyncThunk<
    InformePlacasAutomotrizSP[],
    { fechaDesde; fechaHasta; lineaId; nameModelo }
  >(`AutomotrizJig/GetPlatesByLineAndFromAndUntil`, async ({ fechaDesde, fechaHasta, lineaId, nameModelo }, info) => {
    return await errorNotification(
      () => this.service.GetPlatesByLineAndFromAndUntil(fechaDesde, fechaHasta, lineaId, nameModelo),
      info
    );
  });
 

  GetTesteosByDates = createAsyncThunk<
    IAutomotrizJig[],
    { fechaDesde; fechaHasta;  }
  >(`AutomotrizJig/GetTestsByDates`, async ({ fechaDesde, fechaHasta }, info) => {
    return await errorNotification(
      () => this.service.GetTestsByDates(fechaDesde, fechaHasta),
      info
    );
  });
} //fin de classSlice


export const AutomotrizJigSliceRequest = new automotrizJigClassSlice(automotrizJigService);

const initialState: IIniState<IAutomotrizJig> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const AutomotrizJigSlice = createSlice({
  name: "AutomotrizJig",
  initialState: initialState,
  reducers: {
    setArrayTicketsEstados: (state, actions: PayloadAction<IAutomotrizJig[]>) => {
      state.dataAll = actions.payload;
    }
  },
  extraReducers: (builder) => {
    AutomotrizJigSliceRequest.builderAll(builder);

    builder.addCase(AutomotrizJigSliceRequest.GetTesteosByDates.fulfilled, (state, actions) => {
      state.loading = "fullfilled",
      state.dataAll = actions.payload;
    });
    builder.addCase(AutomotrizJigSliceRequest.GetTesteosByDates.rejected, (state, action) => {
          state.loading = "rejected";
    });
  }
});
