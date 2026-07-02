import { IIniState } from "app/models/IIniState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { RechazoService } from "app/services/rechazo.service";
import { IRechazo } from "app/models/IRechazo";
import { ResumenMensualRechazos } from "app/models/DTO/ResumenMensualRechazosdto";
import { InformeRechazos } from "app/models/InformeRechazos";
import { IInformeRechazoMensual } from "app/models/IInformeRechazoMensual";

const rechazoService = new RechazoService();

class RechazoClassSlice {
  constructor(private service: RechazoService) {}
  getHistorialByCodigo = createAsyncThunk<IRechazo, string>(`Rechazo/GetRechazoByBarcode`, async (codigo, info) => {
    return await errorNotification(() => this.service.GetRechazoByBarcode(codigo), info);
  });
  getAllRechazoByCodigo = createAsyncThunk<IRechazo[], string>(
    `Rechazo/GetAllRechazoByCodigo`,
    async (codigo, info) => {
      return await errorNotification(() => this.service.GetAllRechazoByCodigo(codigo), info);
    }
  );
  getAllByFecha = createAsyncThunk<
    IRechazo[],
    { fechaDesde: string; fechaHasta: string; lineaId: number; turno: string }
  >(`Rechazo/GetAllByFecha`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetAllByFecha(modelo), info);
  });
  getRechazosByDateAndLineaId = createAsyncThunk<
    IRechazo[],
    { fechaDesde: string; fechaHasta: string; lineaId: number; turno: string }
  >(`Rechazo/getRechazosByDateAndLineaId`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetRechazosByDateAndLineaId(modelo), info);
  });
  getKPI = createAsyncThunk<IRechazo[], { fechaDesde: string; fechaHasta: string; lineaId: number; turno: string }>(
    `Rechazo/getKPI`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetKPI(modelo), info);
    }
  );
  getAllByLineaAndFechaAndaDesdeHasta = createAsyncThunk<
    IRechazo[],
    { lineaId: number; fecha: string; horaId: number }
  >(`Rechazo/getAllByLineaAndFechaAndaDesdeHasta`, async (modelo, info) => {
    return await errorNotification(
      () => this.service.GetAllByLineaAndFechaAndDesdeHasta(modelo.lineaId, modelo.fecha, modelo.horaId),
      info
    );
  });
  getInformeMensual = createAsyncThunk<
    ResumenMensualRechazos[],
    { month: number; year: number; lineaId: number; turno: string }
  >(`Rechazo/GetInformeMensual`, async (modelo, info) => {
    return await errorNotification(
      () => this.service.GetInformeMensual(modelo.month, modelo.year, modelo.lineaId, modelo.turno),
      info
    );
  });

  GetAllByFechaLineaHoraGroup = createAsyncThunk<
    ResumenMensualRechazos[],
    { fecha: string; idLinea: number; horaDesde: string; horaHasta: string; conRechazoMain: boolean }
  >(`Rechazo/GetAllByFechaLineaHoraGroup`, async (modelo, info) => {
    return await errorNotification(() => this.service.GetAllByFechaLineaHoraGroup(modelo), info);
  });

  GetAllByLineaIdFechaAndPuesto = createAsyncThunk<
    IRechazo[],
    { fecha: string; idLinea: number; horaDesde: string; horaHasta: string; puestoNombre: string }
  >(`Rechazo/GetAllByLineaIdFechaAndPuesto`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllByLineaIdFechaAndPuesto(modelo), info);
  });
  GetAllByLineaIdFechaAndPuestosNombres = createAsyncThunk<
    IRechazo[],
    {
      fecha: string;
      idLinea: number;
      horaDesde: string;
      horaHasta: string;
      puestoNombre: string;
      puestoNombre2: string;
    }
  >(`Rechazo/GetAllByLineaIdFechaAndPuestos`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllByLineaIdFechaAndPuestosNombre(modelo), info);
  });
  GetRechazosByNroOP = createAsyncThunk<number, string>(`Rechazo/GetRechazosByNroOP`, async (modelo, info) => {
    return await errorNotification(() => this.service.getRechazosByNroOP(modelo), info);
  });
  GetInformeRehazos = createAsyncThunk<InformeRechazos[], { fechaDesde; fechaHasta; lineaId }>(
    `Rechazo/GetInformeRehazos`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetInformeRehazos(modelo), info);
    }
  );
  GetInformeRehazosAgrupados = createAsyncThunk<InformeRechazos[], { fechaDesde; fechaHasta; lineaId }>(
    `Rechazo/GetInformeRehazosAgrupados`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetInformeRehazosAgrupados(modelo), info);
    }
  );
  GetRechazoByHour = createAsyncThunk<any[], { fechaDesde; fechaHasta; idLinea; desde; hasta }>(
    ``,
    async ({ fechaDesde, fechaHasta, idLinea, desde, hasta }, info) => {
      return await errorNotification(
        () => this.service.GetRechazoByHour({ fechaDesde, fechaHasta, idLinea, desde, hasta }),
        info
      );
    }
  );
  GetRechazoByFamilia = createAsyncThunk<
    Array<{ fecha: string; familia: string; puesto: string; total: number; hora: number }>,
    { idLinea; desde; hasta }
  >(`Rechazo/GetRechazosByNroOP`, async ({ idLinea, desde, hasta }, info) => {
    return await errorNotification(() => this.service.GetRechazoByFamilia(idLinea, desde, hasta), info);
  });

  GetAllDateWithDatesAndLinea = createAsyncThunk<IInformeRechazoMensual[], { año; mes; turno; lineaIdAux }>(
    `Rechazo/GetAllDateWithDatesAndLinea`,
    async ({ año, mes, turno, lineaIdAux }, info) => {
      return await errorNotification(() => this.service.GetAllDateWithDatesAndLinea(año, mes, turno, lineaIdAux), info);
    }
  );

  getByFechaLineaId = createAsyncThunk<IRechazo[], { fechaDesde; fechaHasta; lineaId }>(
    "Rechazo",
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetByFechaLineaIdRequest(modelo), info);
    }
  );

  GetListRejectionByDrain = createAsyncThunk<IRechazo[], { fechaDesde; fechaHasta }>(
    "Rechazo/GetListRejectionByDrain",
    async ({ fechaDesde, fechaHasta }, info) => {
      return await errorNotification(() => this.service.GetListRejectionByDrain(fechaDesde, fechaHasta), info);
    }
  );

  GetAllRejectionByDrain = createAsyncThunk<IRechazo[]>(`Rechazo/GetAllRejectionByDrain`, async (_, info) => {
    return await errorNotification(() => this.service.GetAllRejectionByDrain(), info);
  });

  multiDeleteRequest = createAsyncThunk<boolean, string>(`Rechazo/MultiDeleteRequest`, async (modelo, info) => {
    return await errorNotification(() => this.service.MultiDelete(modelo), info);
  });

  deleteMultiBarcode = createAsyncThunk<boolean, string[]>(`Rechazo/DeleteMultiBarcode`, async (modelo, info) => {
    return await errorNotification(() => this.service.DeleteMultiBarcode(modelo), info);
  });

  AddRechazo = createAsyncThunk<boolean, IRechazo>(`Rechazo/AddRechazo`, async (modelo, info) => {
    return await errorNotification(() => this.service.AddRechazo(modelo), info);
  });

  multiPost = createAsyncThunk<boolean, IRechazo[]>(`Rechazo/MultiPost`, async (modelo, info) => {
    return await errorNotification(() => this.service.multiPost(modelo), info);
  });

  deleteRequest = createAsyncThunk<boolean, number>(`Rechazo/DeleteRequest`, async (modelo, info) => {
    return await errorNotification(() => this.service.deleteRequest(modelo), info);
  });

  actualizarRequest = createAsyncThunk<boolean, { barcode: string; estado: string }>(
    `Rechazo/ActualizarRequest`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.ActualizarRequest(modelo), info);
    }
  );
}
export const RechazoSliceRequests = new RechazoClassSlice(rechazoService);

const initialState: IIniState<any> = {
  loading: null,
  dataAll: [],
  data: null,
  object: null
};

export const RechazoSlice = createSlice({
  name: "Rechazo",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(RechazoSliceRequests.getHistorialByCodigo.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.object = action.payload;
    });
    builder.addCase(RechazoSliceRequests.getHistorialByCodigo.rejected, (state, _action) => {
      state.loading = "rejected";
    });

    builder.addCase(RechazoSliceRequests.getAllRechazoByCodigo.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.dataAll = action.payload;
    });
    builder.addCase(RechazoSliceRequests.getAllRechazoByCodigo.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(RechazoSliceRequests.getAllByFecha.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.dataAll = action.payload.map((element, index) => ({ ...element, id: index })); //le agrego el id
    });
    builder.addCase(RechazoSliceRequests.getAllByFecha.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(RechazoSliceRequests.getRechazosByDateAndLineaId.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.dataAll = action.payload.map((element, index) => ({ ...element, id: index })); //le agrego el id
    });
    builder.addCase(RechazoSliceRequests.getRechazosByDateAndLineaId.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(RechazoSliceRequests.getKPI.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.dataAll = action.payload.map((element, index) => ({ ...element, id: index })); //le agrego el id
    });
    builder.addCase(RechazoSliceRequests.getKPI.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(RechazoSliceRequests.getInformeMensual.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.dataAll = action.payload.map((element, index) => ({ ...element, id: index }));
    });
    builder.addCase(RechazoSliceRequests.getInformeMensual.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(RechazoSliceRequests.GetAllByLineaIdFechaAndPuesto.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.dataAll = action.payload;
    });
    builder.addCase(RechazoSliceRequests.GetAllByLineaIdFechaAndPuesto.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(RechazoSliceRequests.GetAllByLineaIdFechaAndPuestosNombres.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.dataAll = action.payload;
    });
    builder.addCase(RechazoSliceRequests.GetAllByLineaIdFechaAndPuestosNombres.rejected, (state, _action) => {
      state.loading = "rejected";
    });

    builder.addCase(RechazoSliceRequests.GetRechazoByHour.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.dataAll = action.payload;
    });
    builder.addCase(RechazoSliceRequests.GetRechazoByHour.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(RechazoSliceRequests.GetInformeRehazos.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.dataAll = action.payload;
    });
    builder.addCase(RechazoSliceRequests.GetInformeRehazos.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(RechazoSliceRequests.GetInformeRehazosAgrupados.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.dataAll = action.payload;
    });
    builder.addCase(RechazoSliceRequests.GetInformeRehazosAgrupados.rejected, (state, _action) => {
      state.loading = "rejected";
    });
  }
});
