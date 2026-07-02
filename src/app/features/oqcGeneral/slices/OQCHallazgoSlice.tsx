import { IIniState } from "app/models/IIniState";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { IOQCHallazgo } from "app/models/IOQCHallazgo";
import { OQCHallazgoService } from "app/features/oqcGeneral/services/oqcHallazgo.service";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
const oqcHallazgoService = new OQCHallazgoService();
class oqcHallazgoClassSlice extends GenericSlice<IOQCHallazgo> {
  constructor(private service: OQCHallazgoService) {
    super("OQCHallazgo", service);
  }
  //nuevos asyncthunks aqui
  getAllByProductoIdRequest = createAsyncThunk<IOQCHallazgo[], number>(
    `OQCHallazgo/GetAllByProductoId`,
    async (productoId, info) => {
      return await errorNotification(() => this.service.GetAllByProductoId(productoId), info);
    }
  );
  getAllByProductoIdAndCategoriaRequest = createAsyncThunk<IOQCHallazgo[], { productoId; categoriaId }>(
    `OQCHallazgo/GetAllByProductoIdAndCategoria`,
    async ({ productoId, categoriaId }, info) => {
      return await errorNotification(() => this.service.GetAllByProductoIdAndCategoria(productoId, categoriaId), info);
    }
  );
  UploadImageHallazgo = createAsyncThunk<boolean, { hallazgoId; file }>(
    `OQCHallazgo/UploadImageHallazgo`,
    async ({ hallazgoId, file }, info) => {
      return await errorNotification(() => this.service.UploadImageHallazgo(hallazgoId, file), info);
    }
  );
}
export const OQCHallazgoSliceRequests = new oqcHallazgoClassSlice(oqcHallazgoService);

const initialState: IIniState<IOQCHallazgo> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcHallazgoSlice = createSlice({
  name: "OQCHallazgo",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IOQCHallazgo>) => {
      state.object = actions.payload;
    }
  },
  extraReducers: (builder) => {
    OQCHallazgoSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(OQCHallazgoSliceRequests.getAllByProductoIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCHallazgoSliceRequests.getAllByProductoIdRequest.rejected, (state) => {
      state.loading = "rejected";
    });
    builder.addCase(OQCHallazgoSliceRequests.getAllByProductoIdAndCategoriaRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCHallazgoSliceRequests.getAllByProductoIdAndCategoriaRequest.rejected, (state) => {
      state.loading = "rejected";
    });
  }
});
