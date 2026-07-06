import { IMaterialesImagen } from "app/models/IMaterialesImagen";
import { MaterialesImagenService } from "app/services/materialesImagen.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { IIniState } from "app/models/IIniState";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const materialesImagenService = new MaterialesImagenService();
class materialesImagenClassSlice extends GenericSlice<IMaterialesImagen> {
  constructor(private service: MaterialesImagenService) {
    super("MaterialesImagen", service);
  }
  Upload = createAsyncThunk<boolean, { material; imageFile }>(
    `MaterialesImagen/GetAllRequest`,

    async (x, info) => {
      return await errorNotification(() => this.service.Upload(x.material, x.imageFile), info);
    }
  );
  getByCodigoWip = createAsyncThunk<boolean, string>(
    `MaterialesImagen/getByCodigoWip`,

    async (x, info) => {
      return await errorNotification(() => this.service.getByCodigoWip(x), info);
    }
  );
  //nuevos asyncthunks aqui
}
export const MaterialesImagenSliceRequests = new materialesImagenClassSlice(materialesImagenService);

const initialState: IIniState<IMaterialesImagen> = {
  loading: null,
  data: null
};

export const materialesImagenSlice = createSlice({
  name: "MaterialesImagen",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    MaterialesImagenSliceRequests.builderAll(builder);
    builder.addCase(MaterialesImagenSliceRequests.getByCodigoWip.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(MaterialesImagenSliceRequests.getByCodigoWip.rejected, (state, action) => {
      state.loading = "rejected";
    });
    //nuevos manejos de asyncthunk aqui
  }
});
