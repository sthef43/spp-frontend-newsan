import { IInicio } from "app/models/IInicio";

import { IIniState } from "app/models/IIniState";
import { InicioService } from "app/services/inicio.service";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { errorNotification } from "../HelperMidleware/errorNotifications";
import { ISPDashboardGetPanelData } from "app/models/sfcsplus/ISPDashboardGetPanelData";
//<IAuth, IAuthUser>

interface Resultado {
  EquiposConSerie: any[];
  EquiposSinSerie: string[];
}

const inicioService = new InicioService();

class InicioClassSlice {
  constructor(private service: InicioService) {}
  //Nuevos endpoints que no heredan de generic
  getAllIniciosRequest = createAsyncThunk<IInicio[], { fecha; turno; codigoInicio }>(
    `Inicio/GetAllInicios`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getAllIniciosRequest(modelo), info);
    }
  );
  getAllByFechaAndTurnoAndOthers = createAsyncThunk<IInicio[], { fecha; turno; codigoInicio; idHora }>(
    `Inicio/getAllByFechaAndTurnoAndCodigoInicio`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetAllByFechaAndTurnoAndOthers(modelo), info);
    }
  );
  getListByFechaAndLinea = createAsyncThunk<IInicio[], { fecha; codigoNewsan }>(
    `Inicio/getListByFechaAndLinea`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByFechaAndLinea(modelo), info);
    }
  );
  getListByFechaAndNombreInicio = createAsyncThunk<IInicio[], { fecha; nombreInicio }>(
    `Inicio/getListByFechaAndNombreInicio`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByFechaAndNombreInicio(modelo), info);
    }
  );
  getListByNombreInicio = createAsyncThunk<IInicio[], { nombreInicio }>(
    `Inicio/getListByFechaAndNombreInicio`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.GetListByNombreInicio(modelo), info);
    }
  );
  getAllIniciosByFechaRequest = createAsyncThunk<IInicio[], { fechaDesde; fechaHasta }>(
    `Inicio/GetAllIniciosDesdeHasta`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getAllIniciosByFechaRequest(modelo), info);
    }
  );
  getAllOpsDelDiaRequest = createAsyncThunk<IInicio[], { fecha; turno; codigoInicio }>(
    `Inicio/GetAllOpsDelDia`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getAllOpsDelDiaRequest(modelo), info);
    }
  );
  getUltimoInicioByLineaRequest = createAsyncThunk<IInicio, { codigoLinea; fechaActual; modelo }>(
    `Inicio/GetUltimoInicioByLinea`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getUltimoInicioByLineaRequest(modelo), info);
    }
  );
  getAllByModelo = createAsyncThunk<IInicio[], string>(`Inicio/GetAllByModelo`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllByModelo(modelo), info);
  });
  getAllByLinea = createAsyncThunk<IInicio[], { fecha; codLinea }>(`Inicio/GetAllByLinea`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllByLinea(modelo), info);
  });
  putRequest = createAsyncThunk<boolean, IInicio>(`Inicio/PutRequest`, async (modelo, info) => {
    return await errorNotification(() => this.service.putRequest(modelo), info);
  });
  cambiarTrazaRequest = createAsyncThunk<boolean, { inicio: IInicio; trazaVieja: string }>(
    `Inicio/CambiarTraza`,
    async ({ inicio, trazaVieja }, info) => {
      return await errorNotification(() => this.service.cambiarTrazaRequest(inicio, trazaVieja), info);
    }
  );
  deleteRequest = createAsyncThunk<boolean, IInicio>(`Inicio/Deleted`, async (modelo, info) => {
    return await errorNotification(() => this.service.deleted(modelo), info);
  });

  postRequest = createAsyncThunk<IInicio, IInicio>(`Inicio/PostRequest`, async (modelo, info) => {
    return await errorNotification(() => this.service.postRequest(modelo), info);
  });
  getByCodigoNewsan = createAsyncThunk<IInicio, string>(`Inicio/GetByCodigoNewsan`, async (modelo, info) => {
    return await errorNotification(() => this.service.getByCodigoNewsan(modelo), info);
  });
  getByCodigoTrazabilidad = createAsyncThunk<IInicio, string>(
    `Inicio/GetByCodigoTrazabilidad`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getByCodigoTrazabilidad(modelo), info);
    }
  );
  getByCodigoTrazabilidadDisponible = createAsyncThunk<IInicio, string>(
    `Inicio/GetByCodigoTrazabilidadDisponible`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getByCodigoTrazabilidadDisponible(modelo), info);
    }
  );
  GetListByNRO_OPRequest = createAsyncThunk<IInicio, string>(`Inicio/GetListByNRO_OP`, async (lista, info) => {
    return await errorNotification(() => this.service.GetListByNRO_OP(lista), info);
  });

  DeleteByIdRequest = createAsyncThunk<boolean, number>(`Inicio/DeleteById`, async (lista, info) => {
    return await errorNotification(() => this.service.DeleteById(lista), info);
  });

  GetListByModeloFinRequest = createAsyncThunk<IInicio, string>(`Inicio/GetListByModeloFin`, async (lista, info) => {
    return await errorNotification(() => this.service.GetListByModeloFin(lista), info);
  });
  getAllbyNroOp = createAsyncThunk<number, string>(`Inicio/GetAllbyNroOp`, async (modelo, info) => {
    return await errorNotification(() => this.service.getAllByNroOp(modelo), info);
  });

  getAllIniciosByFechaTurnoLinea = createAsyncThunk<IInicio[], { fecha; turno; codigoNewsan2 }>(
    `Inicio/GetAllIniciosByFechaTurnoLinea`,
    async (modelo, info) => {
      return await errorNotification(() => this.service.getAllIniciosByFechaTurnoLinea(modelo), info);
    }
  );

  getInformeMensual = createAsyncThunk<any[], { month: number; year: number; codigoInicio: number; turno: string }>(
    `Inicio/GetInformeMensual`,
    async (modelo, info) => {
      return await errorNotification(
        () => this.service.GetInformeMensual(modelo.month, modelo.year, modelo.codigoInicio, modelo.turno),
        info
      );
    }
  );

  getPendienteByOPRequest = createAsyncThunk<number, string>(`Inicio/GetPendienteByOP`, async (OP, info) => {
    return await errorNotification(() => this.service.GetPendienteByOP(OP), info);
  });
  getFamiliaByCN = createAsyncThunk<string, string>(`Inicio/GetFamiliaByCN`, async (CN, info) => {
    return await errorNotification(() => this.service.GetFamiliaByCN(CN), info);
  });
  getModeloProducidoByCN = createAsyncThunk<string, string>(`Inicio/GetModeloProducidoByCN`, async (CN, info) => {
    return await errorNotification(() => this.service.GetModeloProducidoByCN(CN), info);
  });
  GetProducidosPorLinea = createAsyncThunk<ISPDashboardGetPanelData[], string>(
    `Inicio/GetProducidosPorLinea`,
    async (fecha, info) => {
      return await errorNotification(() => this.service.GetProducidosPorLinea(fecha), info);
    }
  );
  GetAllByDesdeHasta = createAsyncThunk<Resultado, string[]>(`Inicio/GetAllByDesdeHasta`, async (fecha, info) => {
    return await errorNotification(() => this.service.GetAllByDesdeHasta(fecha), info);
  });
  GetLastTraza = createAsyncThunk<IInicio, number>(`Inicio/GetLastTraza`, async (idProduccion, info) => {
    return await errorNotification(() => this.service.GetLastTraza(idProduccion), info);
  });
  GetInicioEndedByCodigoNewsan = createAsyncThunk<IInicio, string>(
    `Inicio/GetInicioEndedByCodigoNewsan`,
    async (codigoNewsan, info) => {
      return await errorNotification(() => this.service.GetInicioEndedByCodigoNewsan(codigoNewsan), info);
    }
  );
}
export const InicioSliceRequests = new InicioClassSlice(inicioService);

const initialState: IIniState<IInicio> = {
  loading: null,
  data: null
};

export const InicioSlice = createSlice({
  name: "Inicio",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    //Nuevos slices que no heredan de generic

    builder.addCase(InicioSliceRequests.getAllIniciosRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(InicioSliceRequests.getAllIniciosRequest.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(InicioSliceRequests.getAllOpsDelDiaRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(InicioSliceRequests.getAllOpsDelDiaRequest.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(InicioSliceRequests.getUltimoInicioByLineaRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(InicioSliceRequests.getUltimoInicioByLineaRequest.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(InicioSliceRequests.getAllByModelo.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(InicioSliceRequests.getAllByModelo.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(InicioSliceRequests.putRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(InicioSliceRequests.putRequest.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(InicioSliceRequests.postRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(InicioSliceRequests.getAllByLinea.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(InicioSliceRequests.getAllByLinea.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(InicioSliceRequests.postRequest.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(InicioSliceRequests.getByCodigoNewsan.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(InicioSliceRequests.getByCodigoNewsan.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(InicioSliceRequests.getInformeMensual.fulfilled, (state, action) => {
      state.loading = "fulfiled";
      state.dataAll = action.payload.map((element, index) => ({ ...element, id: index }));
    });
    builder.addCase(InicioSliceRequests.getInformeMensual.rejected, (state, _action) => {
      state.loading = "rejected";
    });

    builder.addCase(InicioSliceRequests.GetListByNRO_OPRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(InicioSliceRequests.GetListByNRO_OPRequest.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(InicioSliceRequests.GetListByModeloFinRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(InicioSliceRequests.GetListByModeloFinRequest.rejected, (state, _action) => {
      state.loading = "rejected";
    });
    builder.addCase(InicioSliceRequests.DeleteByIdRequest.fulfilled, (state, action) => {
      state.loading = "fulfilled";
      state.data = action.payload;
    });
    builder.addCase(InicioSliceRequests.DeleteByIdRequest.rejected, (state, _action) => {
      state.loading = "rejected";
    });
  }
});
