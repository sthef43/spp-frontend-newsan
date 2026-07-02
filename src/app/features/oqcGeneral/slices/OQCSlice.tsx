import { IIniState } from "app/models/IIniState";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { IOQC } from "app/models/IOQC";
import { OQCService } from "app/features/oqcGeneral/services/oqc.service";
import { errorNotification } from "app/Middleware/HelperMidleware/errorNotifications";
import { GenericSlice } from "app/Middleware/reducers/genericSlice";
const oqcService = new OQCService();
class oqcClassSlice extends GenericSlice<IOQC> {
  constructor(private service: OQCService) {
    super("OQC", service);
  }
  //nuevos asyncthunks aqui
  getAllByProductoIdRequest = createAsyncThunk<IOQC[], number>(`OQC/GetAllByProductoId`, async (productoId, info) => {
    return await errorNotification(() => this.service.GetAllByProductoId(productoId), info);
  });
}
export const OQCSliceRequests = new oqcClassSlice(oqcService);

const initialState: IIniState<IOQC> = {
  loading: null,
  data: null,
  dataAll: [],
  object: null
};

export const oqcSlice = createSlice({
  name: "OQC",
  initialState: initialState,
  reducers: {
    setObject: (state, actions: PayloadAction<IOQC>) => {
      state.object = actions.payload;
    }
  },
  extraReducers: (builder) => {
    OQCSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(OQCSliceRequests.getAllByProductoIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(OQCSliceRequests.getAllByProductoIdRequest.rejected, (state) => {
      state.loading = "rejected";
    });
  }
});
