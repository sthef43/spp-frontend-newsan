import { IImpresionEtiqueta } from "app/models/IImpresionEtiqueta";

import { ImpresionEtiquetaService } from "app/services/impresionEtiqueta.service";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";

interface PrinterDetails {
  name: string;
  isDefault: boolean;
  option: { [key: string]: string; };
}

const impresionEtiquetaService = new ImpresionEtiquetaService();

class ImpresionEtiquetaClassSlice {
  constructor(private service: ImpresionEtiquetaService) { }
  //Nuevos endpoints que no heredan de generic
  getByOP = createAsyncThunk<IImpresionEtiqueta[], string>(`ImpresionEtiqueta/getByOP`, async (modelo, info) => {
    return await errorNotification(() => this.service.getByOp(modelo), info);
  });
  GetAllImpresionByDateOPAndOpcion = createAsyncThunk<IImpresionEtiqueta[], { fechaDesde, fechaHasta, op, opcion }>(`ImpresionEtiqueta/GetAllImpresionByDateOPAndOpcion`, async ({ fechaDesde, fechaHasta, op, opcion }, info) => {
    return await errorNotification(() => this.service.GetAllImpresionByDateOPAndOpcion(fechaDesde, fechaHasta, op, opcion), info);
  });
  GetAllImpresionByDateLineaAndOpcion = createAsyncThunk<IImpresionEtiqueta[], { fechaDesde, fechaHasta, lineaId, opcion }>(`ImpresionEtiqueta/GetAllImpresionByDateLineaAndOpcion`, async ({ fechaDesde, fechaHasta, lineaId, opcion }, info) => {
    return await errorNotification(() => this.service.GetAllImpresionByDateLineaAndOpcion(fechaDesde, fechaHasta, lineaId, opcion), info);
  });
  getByCodIntAndLineaId = createAsyncThunk<IImpresionEtiqueta, { codInt; lineaId }>(
    `ImpresionEtiqueta/GetByCodIntAndLineaId`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getByCodIntAndLineaId(modelo), info);
    }
  );
  postRequest = createAsyncThunk<IImpresionEtiqueta, IImpresionEtiqueta>(
    `ImpresionEtiqueta/postRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.post(modelo), info);
    }
  );
  // RFID
  postRFIDRequest = createAsyncThunk<any, any>(
    `ImpresionEtiqueta/postRFIDRequest`,
    async (payload, info) => {
      return await errorNotification(() => this.service.postRFID(payload), info);
    }
  );

  deleteWithRFIDRequest = createAsyncThunk<boolean, number>(
    `ImpresionEtiqueta/deleteWithRFIDRequest`,
    async (id, info) => {
      return await errorNotification(() => this.service.deleteWithRFID(id), info);
    }
  );
  putRequest = createAsyncThunk<IImpresionEtiqueta, IImpresionEtiqueta>(
    `ImpresionEtiqueta/putRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.put(modelo), info);
    }
  );
  deleteRequest = createAsyncThunk<IImpresionEtiqueta, number>(
    `ImpresionEtiqueta/deleteRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.delete(modelo), info);
    }
  );

  chechServer = createAsyncThunk<boolean>(
    `ImpresionEtiqueta/checkServer`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.CheckServer(), info)
    }
  );
  getListaImpresoras = createAsyncThunk<PrinterDetails[]>(
    `ImpresionEtiqueta/getListaImpresoras`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListaImpresoras(), info)
    }
  );
  imprimir = createAsyncThunk<any, { impresora, zpl }>(
    `ImpresionEtiqueta/imprimir`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.Imprimir(modelo.impresora, modelo.zpl), info)
    }
  );
  getRFIDByCodigoInterno = createAsyncThunk<any, string>(
    `ImpresionEtiqueta/getRFIDByCodigoInterno`,
    async (codigoInterno, info) => {
      return await errorNotification(() => this.service.getRFIDByCodigoInterno(codigoInterno), info);
    }
  );
}
export const ImpresionEtiquetaSliceRequests = new ImpresionEtiquetaClassSlice(impresionEtiquetaService);
// interface IInitImpresionEtiquetas extends IIniState<IImpresionEtiqueta> {
//   filteredData: any[];
// }
const initialState: any = {
  loading: null,
  filteredData: [],
  data: null
};

export const ImpresionEtiquetaSlice = createSlice({
  name: "ImpresionEtiqueta",
  initialState: initialState,
  reducers: {
    filtrar: (state, action: PayloadAction<number>) => {
      state.filteredData = state.dataAll.filter((x) => x.idTipoEtiqueta == action.payload);
    },
    setClear: (state) => {
      state.dataAll = [];
      state.object = null;
    }
  },
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic
    builder.addCase(ImpresionEtiquetaSliceRequests.getByOP.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(ImpresionEtiquetaSliceRequests.getByOP.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ImpresionEtiquetaSliceRequests.GetAllImpresionByDateOPAndOpcion.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(ImpresionEtiquetaSliceRequests.GetAllImpresionByDateOPAndOpcion.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ImpresionEtiquetaSliceRequests.GetAllImpresionByDateLineaAndOpcion.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.dataAll = action.payload;
    });
    builder.addCase(ImpresionEtiquetaSliceRequests.GetAllImpresionByDateLineaAndOpcion.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ImpresionEtiquetaSliceRequests.postRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ImpresionEtiquetaSliceRequests.postRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ImpresionEtiquetaSliceRequests.deleteRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ImpresionEtiquetaSliceRequests.deleteRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ImpresionEtiquetaSliceRequests.putRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ImpresionEtiquetaSliceRequests.putRequest.rejected, (state, action) => {
      state.loading = "rejected";
    });
    builder.addCase(ImpresionEtiquetaSliceRequests.getByCodIntAndLineaId.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(ImpresionEtiquetaSliceRequests.getByCodIntAndLineaId.rejected, (state, action) => {
      state.loading = "rejected";
    });
  }
});
