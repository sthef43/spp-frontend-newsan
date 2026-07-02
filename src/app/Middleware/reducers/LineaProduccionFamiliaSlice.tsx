import { IIniState } from "app/models/IIniState";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//<IAuth, IAuthUser>
import { GenericSlice } from "./genericSlice";
import { LineaProduccionFamiliaService } from "app/services/lineaProduccionFamilia.service";
import { ILineaProduccionFamilia } from "app/models/ILineaProduccionFamilia";
import { errorNotification } from "../HelperMidleware/errorNotifications";

const lineaProduccionFamiliaService = new LineaProduccionFamiliaService();
class lineaProduccionFamiliaClassSlice extends GenericSlice<ILineaProduccionFamilia> {
  constructor(private service: LineaProduccionFamiliaService) {
    super("LineaProducionFamilia", service);
  }

  //nuevos asyncthunks aqui
  getAllByLineaId = createAsyncThunk<ILineaProduccionFamilia[], number>(
    `LineaProduccionFamilia/GetAllByLineaId`,
    async (lineaId, info) => {
      return await errorNotification(() => this.service.getAllByLineaId(lineaId), info);
    }
  );

  getByLineaAndFamilia = createAsyncThunk<ILineaProduccionFamilia, { linea; familia }>(
    `LineaProduccionFamilia/getByLineaAndFamilia`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getByLineaAndFamilia(modelo), info);
    }
  );

  GetAllFamiliesByLineaAndProveedorId = createAsyncThunk<ILineaProduccionFamilia, { lineaId; proveedorId }>(
    `LineaProduccionFamilia/GetAllFamiliesByLineaAndProveedorId`,
    async ({ lineaId, proveedorId }, info) => {
      return await errorNotification(() => this.service.GetAllFamiliesByLineaAndProveedorId(lineaId, proveedorId), info);
    }
  );

  GetSemielaboradoActivoByLinea = createAsyncThunk<ILineaProduccionFamilia, string>(
    `LineaProduccionFamilia/GetSemielaboradoActivoByLinea`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetSemielaboradoActivoByLinea(modelo), info);
    }
  );

  ActivarSemielaborado = createAsyncThunk<ILineaProduccionFamilia, { codigoInicio; familiaId; semielaboradoIAId }>(
    `LineaProduccionFamilia/ActivarSemielaborado`,
    async (data, info) => {
      return await errorNotification(
        () => this.service.ActivarSemielaborado(data.codigoInicio, data.familiaId, data.semielaboradoIAId),
        info
      );
    }
  );

}
export const LineaProduccionFamiliaSliceRequests = new lineaProduccionFamiliaClassSlice(lineaProduccionFamiliaService);

const initialState: IIniState<ILineaProduccionFamilia> = {
  loading: null,
  data: null
};

export const lineaProduccionFamiliaSlice = createSlice({
  name: "LineaProduccionFamilia",
  initialState: initialState,
  reducers: {
    setObject: (state, payload: PayloadAction<ILineaProduccionFamilia>) => {
      state.object = payload.payload;
    }
  },
  extraReducers: (builder) => {
    LineaProduccionFamiliaSliceRequests.builderAll(builder);
    //nuevos manejos de asyncthunk aqui
    builder.addCase(LineaProduccionFamiliaSliceRequests.getAllByLineaId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
      state.dataAll = action.payload;
    });
    builder.addCase(LineaProduccionFamiliaSliceRequests.getAllByLineaId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
