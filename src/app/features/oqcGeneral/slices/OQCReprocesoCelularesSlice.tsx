/* eslint-disable unused-imports/no-unused-vars */
import { OQCReprocesoCelularesService } from "app/features/oqcGeneral/services/oqcReprocesoCelulares.service";
import { IOQCReprocesoCelulares } from "app/models/IOQCReprocesoCelulares";
import { IIniState } from "app/models";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";

const oqcReprocesoCelularesService = new OQCReprocesoCelularesService();

class oqcReprocesoCelularesClassSlice extends GenericSlice<IOQCReprocesoCelulares> {
  constructor(private service: OQCReprocesoCelularesService) {
    super("OQCReprocesoCelulares", service);
  }

  GetSampleByTrackId = createAsyncThunk<IOQCReprocesoCelulares, string>(
    `OQCReprocesoCelulares/GetSampleByTrackId`,
    async (trackId, info) => {
      return await errorNotification(() => this.service.GetSampleByTrackId(trackId), info);
    }
  );

  GetListSamplesByLpn = createAsyncThunk<IOQCReprocesoCelulares[], string>(
    `OQCReprocesoCelulares/GetListSamplesByLpn`,
    async (lpn, info) => {
      return await errorNotification(() => this.service.GetListSamplesByLpn(lpn), info);
    }
  );

  GetSampleByImeiCode = createAsyncThunk<IOQCReprocesoCelulares, string>(
    `OQCReprocesoCelulares/GetSampleByImeiCode`,
    async (imeiCode, info) => {
      return await errorNotification(() => this.service.GetSampleByImeiCode(imeiCode), info);
    }
  );
}
export const OQCReprocesoCelularesSliceRequest = new oqcReprocesoCelularesClassSlice(oqcReprocesoCelularesService);

const initialState: IIniState<IOQCReprocesoCelulares> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcReprocesoCelularesSlice = createSlice({
  name: "OQCReprocesoCelulares",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    OQCReprocesoCelularesSliceRequest.builderAll(builder);
    builder.addCase(OQCReprocesoCelularesSliceRequest.GetSampleByTrackId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.object = action.payload;
    });
    builder.addCase(OQCReprocesoCelularesSliceRequest.GetSampleByTrackId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
