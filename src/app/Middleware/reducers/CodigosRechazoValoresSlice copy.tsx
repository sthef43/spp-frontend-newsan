import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GenericSlice } from "./genericSlice";
import { CodigosRechazoValoresService } from "app/services/codigosRechazoValores.service";
import { ICodigosRechazosValores } from "app/models/ICodigosRechazosValores";
import { errorNotification } from "../HelperMidleware/errorNotifications";
const codigosRechazoValoresService = new CodigosRechazoValoresService();
class codigosRechazoValoresClassSlice extends GenericSlice<ICodigosRechazosValores> {
  constructor(private service: CodigosRechazoValoresService) {
    super("CodigosRechazoValores", service);
  }
  getAllByCodId = createAsyncThunk<ICodigosRechazosValores[], { codId: number; productoId: number }>(
    `CodigosRechazoValores/getAllByCodId`,
    async (data, info) => {
      return await errorNotification(() => this.service.getAllByCodId(data.codId, data.productoId), info);
    }
  );
  //nuevos asyncthunks aqui
}
export const CodigosRechazoValoresSliceRequests = new codigosRechazoValoresClassSlice(codigosRechazoValoresService);

const initialState: IIniState<ICodigosRechazosValores> = {
  loading: null,
  data: null
};

export const codigosDeRechazosSlice = createSlice({
  name: "CodigosRechazoValores",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    CodigosRechazoValoresSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(CodigosRechazoValoresSliceRequests.getAllByCodId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(CodigosRechazoValoresSliceRequests.getAllByCodId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
