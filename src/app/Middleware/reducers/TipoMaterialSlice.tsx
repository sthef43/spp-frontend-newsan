import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TipoMaterialService } from "app/services/tipoMaterial.service";
import { ITipoMaterial } from "app/models/ITipoMaterial";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const tipoMaterialService = new TipoMaterialService();
class tipoMaterialClassService extends GenericSlice<ITipoMaterial> {
  constructor(private service: TipoMaterialService) {
    super("TipoMaterial", service);
  }
  getAllByProductId = createAsyncThunk<ITipoMaterial[], number>(`TipoMaterial/GetAllByProductId`, async (id, info) => {
    return await errorNotification(() => this.service.getAllByProductId(id), info);
  });
  //nuevos asyncthunks aqui
}
export const TipoMaterialSliceRequests = new tipoMaterialClassService(tipoMaterialService);

const initialState: IIniState<ITipoMaterial> = {
  loading: null,
  data: null,
  dataAll: []
};

export const tipoMaterialSlice = createSlice({
  name: "TipoMaterial",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    TipoMaterialSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(TipoMaterialSliceRequests.getAllByProductId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(TipoMaterialSliceRequests.getAllByProductId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
