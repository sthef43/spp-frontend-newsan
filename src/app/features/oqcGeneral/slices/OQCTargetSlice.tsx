import { IIniState } from "app/models/IIniState";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { IOQCTarget } from "app/models/IOQCTarget";
import { OQCTargetService } from "app/features/oqcGeneral/services/oqcTarget.service";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
const oqcTargetService = new OQCTargetService();
class oqcTargetClassSlice extends GenericSlice<IOQCTarget> {
  constructor(private service: OQCTargetService) {
    super("OQCTarget", service);
  }
  //nuevos asyncthunks aqui
  getAllByProductoIdRequest = createAsyncThunk<IOQCTarget[], number>(
    `OQCTarget/GetAllByProductoId`,
    async (productoId, info) => {
      return await errorNotification(() => this.service.GetAllByProductoId(productoId), info);
    }
  );
  getByLineaId = createAsyncThunk<IOQCTarget, number>(`OQCTarget/GetByLineaId`, async (lineaId, info) => {
    return await errorNotification(() => this.service.GetByLineaId(lineaId), info);
  });
  getByProducto = createAsyncThunk<IOQCTarget, number>(`OQCTarget/getByProducto`, async (productoId, info) => {
    return await errorNotification(() => this.service.GetByProductoId(productoId), info);
  });
}
export const OQCTargetSliceRequests = new oqcTargetClassSlice(oqcTargetService);

const initialState: IIniState<IOQCTarget> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcTargetSlice = createSlice({
  name: "OQCTarget",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IOQCTarget>) => {
      state.object = actions.payload;
    }
  },
  extraReducers: (builder) => {
    OQCTargetSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(OQCTargetSliceRequests.getAllByProductoIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCTargetSliceRequests.getAllByProductoIdRequest.rejected, (state) => {
      state.loading = "rejected";
    });
    builder.addCase(OQCTargetSliceRequests.getByLineaId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.object = action.payload;
    });
    builder.addCase(OQCTargetSliceRequests.getByLineaId.rejected, (state) => {
      state.loading = "rejected";
    });
    builder.addCase(OQCTargetSliceRequests.getByProducto.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.object = action.payload;
    });
    builder.addCase(OQCTargetSliceRequests.getByProducto.rejected, (state) => {
      state.loading = "rejected";
    });
  }
});
