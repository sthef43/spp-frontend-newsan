import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IValidarMaterial } from "app/models/IValidarMaterial";
import { ValidarMaterialService } from "app/services/validarMaterial.service";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const validarMaterialService = new ValidarMaterialService();
class validarMaterialClassService extends GenericSlice<IValidarMaterial> {
  constructor(private service: ValidarMaterialService) {
    super("ValidarMaterial", service);
  }
  //nuevos asyncthunks aqui
  getAllByFamiliaId = createAsyncThunk<IValidarMaterial[], number>(
    "ValidarMaterial/GetAllByFamiliaId",
    async (familiaId, info) => {
      return await errorNotification(() => this.service.getAllByFamiliaId(familiaId), info);
    }
  );
}
export const ValidarMaterialSliceRequests = new validarMaterialClassService(validarMaterialService);

const initialState: IIniState<IValidarMaterial> = {
  loading: null,
  data: null
};

export const validarMaterialSlice = createSlice({
  name: "ValidarMaterial",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    ValidarMaterialSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(ValidarMaterialSliceRequests.getAllByFamiliaId.fulfilled, (state, action) => {
      state.loading = "fulilled";
      state.dataAll = action.payload;
    });
    builder.addCase(ValidarMaterialSliceRequests.getAllByFamiliaId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
